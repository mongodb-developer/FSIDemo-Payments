const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId
const serviceName = 'USER_MANAGEMENT'


const encryptedFieldsMap = {
    encryptedFields: {
        fields: [
            {
                path: "password", // Encrypting the password
                bsonType: "string",
                queries: { queryType: "equality" }
            },
            {
                path: "email", // Encrypting the email
                bsonType: "string",
                queries: { queryType: "equality" }
            }
        ]
    }
};

async function preWarmConnection() {
    try {
        await dbService.getEncryptedCollection('users', serviceName, encryptedFieldsMap)
        logger.info(`user.service.js-preWarmConnection: pre-warmed users`);
    } catch (err) {
        logger.error('user.service.js-preWarmConnection: cannot pre-warm users', err);
    }
}

preWarmConnection();

function cleanUser(user) {
    delete user.password;
    delete user.__safeContent__;
    return user;
}

/**
 * Queries encrypted user collection based on given filter criteria.
 * 
 * @param {Object} [filterBy={}] - Filter criteria for querying the users.
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
 */
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy);

    try {
        // Get the encrypted 'users' collection
        const { collection, session } = await dbService.getEncryptedCollection('users', serviceName, encryptedFieldsMap);
        
        // Perform the query and convert the result to an array
        let users = await collection.find(criteria).toArray();

        // Process each user object in the array
        users = users.map(user => {
            // Remove sensitive data before returning
            
            return cleanUser(user);
        });

        return users;
    } catch (err) {
        // Log the error for debugging and rethrow it for handling upstream
        logger.error(`user.service.js-query: cannot find users`, err);
        throw err;
    }
}


/**
 * Retrieves a user by their ID from an encrypted collection.
 * 
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 */
async function getById(userId) {
    try {
        const { collection } = await dbService.getEncryptedCollection('users', serviceName, encryptedFieldsMap);
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        // Remove sensitive data before returning
        return cleanUser(user);
    } catch (err) {
        logger.error(`user.service.js-getById: while finding user by id: ${userId}`, err);
        throw err;
    }
}

/**
 * Retrieves a user by their username from an encrtyped collection.
 * 
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 */
async function getByUsername(username) {
    try {
        const { collection } = await dbService.getEncryptedCollection('users', serviceName);
        const user = await collection.findOne({ username });

        // Remove sensitive data before returning
        return cleanUser(user);
    } catch (err) {
        logger.error(`user.service.js-getByUsername: while finding user by username: ${username}`, err);
        throw err;
    }
}

/**
 * Retrieves a user by their email.
 * 
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 */
async function getByEmail(email) {
    try {
        const { collection } = await dbService.getEncryptedCollection('users', serviceName);
        const user = await collection.findOne({ email });

        // Remove sensitive data before returning
        return cleanUser(user);
    } catch (err) {
        logger.error(`user.service.js-getByEmail: while finding user by email: ${email}`, err);
        throw err;
    }
}

/**
 * Removes a user by their ID.
 * 
 * @param {string} userId - The ID of the user to remove.
 */
async function remove(userId) {
    try {
        const { collection } = await dbService.getCollection('users', serviceName);
        await collection.deleteOne({ _id: new ObjectId(userId) });
    } catch (err) {
        logger.error(`user.service.js-remove: cannot remove user ${userId}`, err);
        throw err;
    }
}


/**
 * Adds a new user to the encrypted collection.
 * 
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<Object>} - A promise that resolves to the added user object, excluding the password.
 */
async function add(user) {
    try {
        // Prepare the user object to be added
        const userToAdd = {
            username: user.username,
            password: user.password, // Password will be encrypted in the database
            email: user.email,
            imgUrl: user.imgUrl,
            linkedAccounts: [], // Initialize with empty linked accounts
            recentTransactions: [] // Initialize with empty transactions array
        };

        // Get the encrypted 'users' collection
        const { collection } = await dbService.getEncryptedCollection('users', serviceName, encryptedFieldsMap);

        // Insert the new user into the collection
        await collection.insertOne(userToAdd);

        // Remove password before returning the user object
        delete userToAdd.password;

        return userToAdd;
    } catch (err) {
        // Log the error for debugging and rethrow it for handling upstream
        logger.error(`user.service.js-add: cannot add user`, err);
        throw err;
    }
}

/**
 * Updates linked accounts for a specified user in an encrypted collection.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {Array|Object} accountDetails - The linked account details to be added.
 * @param {Object} [collection] - Optional. The MongoDB collection.
 * @param {Object} [session] - Optional. The MongoDB session for transactions.
 * @returns {Promise<Object>} - The updated user object.
 */
async function updateLinkedAccounts(userId, accountDetails, collection = undefined, session = undefined) {
    try {
        // Get the encrypted 'users' collection if not provided
        if (!collection || !session) {
            const db = await dbService.getEncryptedCollection('users', serviceName);
            collection = db.collection;
            session = db.session;
        }

        // If accountDetails is an array, add each account separately to the linkedAccounts array
        const updateQuery = Array.isArray(accountDetails) ? 
            { $addToSet: { linkedAccounts: { $each: accountDetails } } } : 
            { $addToSet: { linkedAccounts: accountDetails } };

        // Update the user's linked accounts
        await collection.updateOne({ _id: new ObjectId(userId) }, updateQuery, { session });

        // Commit the transaction if one was started
        if (session && session.inTransaction()) {
            await session.commitTransaction();
        }

        // Return the updated user object
        return await getById(userId);
    } catch (err) {
        // Abort the transaction if one was started
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        logger.error(`user.service.js-updateLinkedAccounts: cannot update linked accounts for user ${userId}`, err);
        throw err;
    } 
    finally {
        if (session) {
            session.endSession();
        }
    }
}


/**
 * Adds a transaction to a user's record in a regular collection.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {Object} transaction - The transaction details to be added.
 * @param {Object} [collection] - Optional. The MongoDB collection.
 * @param {Object} [session] - Optional. The MongoDB session for transactions.
 * @returns {Promise<Object>} - The updated user object.
 */
async function addTransaction(userId, transaction, collection = undefined, session = undefined) {
    try {
        if (!collection || !session) {
            const db = await dbService.getCollection('users', serviceName);
            collection = db.collection;
            session = db.session;
        }

        await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { recentTransactions: { $each: [transaction], $slice: -10 } } }, // Keeps only the latest 10 transactions
            { session }
        );

        if (session && session.inTransaction()) {
            await session.commitTransaction();
        }

        return await getById(userId);
    } catch (err) {
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        logger.error(`user.service.js-addTransaction: cannot add transaction for user ${userId}`, err);
        throw err;
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

async function getRecentTransactions(userId) {
    try {
        const {collection, session}= await dbService.getCollection('users', serviceName)
        const user = await collection.findOne({ _id: ObjectId(userId) }, { recentTransactions: 1 } )
        return user.recentTransactions
    } catch (err) {
       // logger.error(`cannot get recent transactions for user ${userId}`, err)
         logger.error(`user.service.js-getRecentTransactions: cannot get recent transactions for user ${userId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    // Text search in username or fullname
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            { username: txtCriteria },
            { email: txtCriteria }
        ]
    }


    // Example: Filter by a specific account type
    if (filterBy.accountType) {
        criteria['linkedAccounts.accountType'] = { $eq: filterBy.accountType }
    }

    // Example: Filter by transaction amount range
    if (filterBy.transactionAmountMin && filterBy.transactionAmountMax) {
        criteria['recentTransactions.amount'] = { 
            $gte: filterBy.transactionAmountMin,
            $lte: filterBy.transactionAmountMax
        }
    }

    // Add other filters as needed based on your application's requirements

    return criteria
}

module.exports = {
    query,
    getById,
    getByUsername,
    getByEmail,
    remove,
    add,
    updateLinkedAccounts,
    addTransaction,
    getRecentTransactions
}