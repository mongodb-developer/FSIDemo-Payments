const dbService = require('../../services/db.service');
const userService = require('../user/user.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;
const serviceName = 'ACCOUNT_MANAGEMENT';

const encryptedFieldsMap = {
    encryptedFields: {
        fields: [
            {
                path: "accountNumber", // Encrypting the account number
                bsonType: "string",
                queries: { queryType: "equality" }
            },
            {
                path: "encryptedDetails", // Encrypting additional account details
                bsonType: "object",
            }
        ]
    }
};

async function preWarmConnection(){
    try {
        await Promise.all([dbService.getEncryptedCollection('accounts', serviceName, encryptedFieldsMap), userService.preWarmConnection()])
        logger.info(`account.service.js-preWarmConnection: pre-warmed accounts`);
    } catch (err) {
        logger.error('account.service.js-preWarmConnection: cannot pre-warm accounts', err);
    }
}

preWarmConnection();

/**
 * Queries the encrypted accounts collection based on provided filter criteria.
 * 
 * @param {Object} filterBy - Criteria used for filtering the accounts.
 * @returns {Promise<Array>} - A promise that resolves to an array of account objects.
 */
async function query(filterBy) {
    try {
        // Build query criteria from the filter
        const criteria = _buildCriteria(filterBy);

        // Get the encrypted 'accounts' collection
        const { collection } = await dbService.getEncryptedCollection('accounts', serviceName, encryptedFieldsMap);
       
        // Query the collection and convert to an array
        const accounts = await collection.find(criteria).toArray();

        return accounts;
    } catch (err) {
        // Log and rethrow the error for handling upstream
        logger.error('account.service.js-query: cannot find accounts', err);
        throw err;
    }
}


/**
 * Retrieves an account by its ID from an encrypted collection and enriches it with user information.
 * 
 * @param {string} accountId - The ID of the account to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the account object with user information.
 */
async function getById(accountId) {
    try {
        const { collection } = await dbService.getEncryptedCollection('accounts', serviceName, encryptedFieldsMap);
        let account = await collection.findOne({ _id: new ObjectId(accountId) });

        // Retrieve user information and add it to the account object
        if (account && account.userId) {
            const user = await userService.getById(account.userId);
            account.user = { username: user.username };
        }

        return account;
    } catch (err) {
        logger.error(`account.service.js-getById: while finding account ${accountId}`, err);
        throw err;
    }
}

/**
 * Retrieves an account by its account number from an encrypted collection.
 * 
 * @param {string} accountNumber - The account number of the account to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the account object.
 */
async function getByAccNumber(accountNumber) {
    try {
        const { collection } = await dbService.getEncryptedCollection('accounts', serviceName, encryptedFieldsMap);
        const account = await collection.findOne({ accountNumber });

        return account;
    } catch (err) {
        logger.error(`account.service.js-getByAccNumber: while finding account with number ${accountNumber}`, err);
        throw err;
    }
}


/**
 * Removes an account by its ID.
 * 
 * @param {string} accountId - The ID of the account to remove.
 * @returns {Promise<number>} - A promise that resolves to the count of deleted documents.
 */
async function remove(accountId) {
    try {
        // Retrieve the store from the async local storage if needed
        const store = asyncLocalStorage.getStore(); // Assuming asyncLocalStorage is defined elsewhere

        const { collection } = await dbService.getCollection('accounts');
        const criteria = { _id: new ObjectId(accountId) };
        const { deletedCount } = await collection.deleteOne(criteria);

        return deletedCount;
    } catch (err) {
        logger.error(`account.service.js-remove: cannot remove account ${accountId}`, err);
        throw err;
    }
}


/**
 * Adds a new account with provided details and updates the linked accounts for the user.
 * 
 * @param {string} userId - The ID of the user to whom the account belongs.
 * @param {Object} accountDetails - The details of the account to add.
 * @returns {Promise<Object>} - A promise that resolves to the saved account and updated user.
 */
async function add(userId, accountDetails) {
    try {
        // Construct the new account object from the provided details
        const accountsToAdd = {
            userId: new ObjectId(userId), // Convert userId to MongoDB ObjectId
            accountNumber: accountDetails.accountNumber, // This will be encrypted
            accountType: accountDetails.accountType,
            balance: accountDetails.balance,
            limitations: accountDetails.limitations,
            securityTags: accountDetails.securityTags,
            encryptedDetails: accountDetails.details // Encrypted string of sensitive data
        };

        // Get the encrypted collection for accounts
        const { collection, session } = await dbService.getEncryptedCollection('accounts', serviceName, encryptedFieldsMap);
        
        // Start a new transaction
        session.startTransaction();

        // Insert the new account into the collection
        const result = await collection.insertOne(accountsToAdd, { session });

        // Prepare the account data to be added to the user's linked accounts
        const accountInfoForUser = {
            accountId: result.insertedId, // Reference to the newly created account
            accountType: accountsToAdd.accountType,
            limitations: accountsToAdd.limitations,
            securityTags: accountsToAdd.securityTags
        };
      
        // Get users collection from the same client transaction
        const users = await dbService.getEncryptedCollection('users', serviceName, encryptedFieldsMap);

        // Update the user's linked accounts with the new account information
        const updatedUser = await userService.updateLinkedAccounts(userId, accountInfoForUser, users.collection, session);

        // Commit the transaction to finalize changes
        if (session && session.inTransaction()){
            await session.commitTransaction();
        }

        // Return the account info and updated user data
        return { savedAccount: accountInfoForUser, updatedUser };
    } catch (err) {
        // In case of an error, abort the transaction
        logger.error('account.service.js-add: cannot insert accounts', err);
        if (session && session.inTransaction()) await session.abortTransaction();
        
        throw err;
    } 
    // finally {
    //     // End the session after the operation (successful or not)
    //     if (session) session.endSession();
    // }
}
/*
    * Builds a MongoDB query object based on provided filter criteria.
    * 
    * @param {Object} filterBy - The filter criteria.
    * @returns {Object} - A MongoDB query object.
    */

function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.byUserId) criteria.userId = filterBy.userId
    else{

        throw new Error('Cannot filter accounts without a user ID')
    }
    criteria = { ...criteria, ...filterBy }

    return criteria
}

module.exports = {
    query,
    remove,
    getById,
    getByAccNumber,
    add
}


