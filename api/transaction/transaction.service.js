const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId
const serviceName = 'TRANSACTION_MANAGEMENT'
const userService = require('../user/user.service')
const accountService = require('../account/account.service')

const encryptedFieldsMap = {
    encryptedFields: {
        fields: [
            
            {
                path: "details", // Encrypting the password
                bsonType: "object",
            },
            {
                path: "referenceData.sender.accountNumber", // Encrypting the email
                bsonType: "string",
                queries: { queryType: "equality" }
            },
            {
                path: "referenceData.receiver.accountNumber", // Encrypting the email
                bsonType: "string",
                queries: { queryType: "equality" }
            }
        ]
    }
}

// Transaction Service

async function preWarmConnection(){
    try {
        await dbService.getEncryptedCollection('transactions', serviceName, encryptedFieldsMap)
        logger.info(`transaction.service.js-preWarmConnection: pre-warmed transactions`);
    } catch (err) {
        logger.error('transaction.service.js-preWarmConnection: cannot pre-warm transactions', err);
    }
}

preWarmConnection();

// docs/FSI - Payments Demo Architecture.txt

/**
 * Queries the encrypted transactions collection based on provided filter criteria.
 * 
 * @param {Object} filterBy - Criteria used for filtering the transactions.
 * @returns {Promise<Array>} - A promise that resolves to an array of transaction objects.
 */
async function query(filterBy) {
    // Build query criteria from the filter
    const criteria = _buildCriteria(filterBy);

    try {
        // Get the encrypted 'transactions' collection
        const { collection } = await dbService.getEncryptedCollection('transactions', serviceName);
        
        // Query the collection and convert the result to an array
        const transactions = await collection.find(criteria).toArray();

        return transactions;
    } catch (err) {
        // Log the error for debugging and rethrow it for handling upstream
        logger.error(`transaction.service.js-query: cannot find transactions`, err);
        throw err;
    }
}

/**
 * Retrieves a transaction by its ID from an encrypted collection.
 * 
 * @param {string} transactionId - The ID of the transaction to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the transaction object.
 */
async function getById(transactionId) {
    try {
        // Get the encrypted 'transactions' collection
        const { collection } = await dbService.getEncryptedCollection('transactions', serviceName);

        // Find the transaction by its ObjectId
        const transaction = await collection.findOne({ _id: new ObjectId(transactionId) });

        return transaction;
    } catch (err) {
        // Log the error and rethrow it for handling upstream
        logger.error(`transaction.service.js-getById: cannot find transaction ${transactionId}`, err);
        throw err;
    }
}


/**
 * Validates the initiation of a transaction by checking sender, receiver, and amount.
 * Ensures that the sender and receiver are not the same and both accounts exist.
 * 
 * @param {Object} sender - The sender's information.
 * @param {Object} receiver - The receiver's information.
 * @param {number} amount - The amount to be transacted.
 * @returns {Promise<{senderAccount: Object, receiverAccount: Object}>} - The accounts of the sender and receiver.
 * @throws {Error} - If validation fails.
 */
async function validateTrasactionInitiate(sender, receiver, amount) {
    // Validate required fields
    if (!sender) throw new Error('sender is required');
    if (!receiver) throw new Error('receiver is required');
    if (!amount) throw new Error('amount is required');
    if (sender.accountId === receiver.accountId) throw new Error('sender and receiver cannot be the same');

    // Retrieve accounts for sender and receiver
    const senderAccount = await accountService.getById(sender.accountId);
    const receiverAccount = await accountService.getById(receiver.accountId);

    // Ensure both accounts exist
    if (!senderAccount) throw new Error(`sender ${sender._id} account not found`);
    if (!receiverAccount) throw new Error(`receiver ${receiver._id} account not found`);
    
    // Funds validation

    // Further validations can be added here (e.g., checking balance)
        // if (senderAccount.balance < amount) throw new Error(`sender ${sender._id} has insufficient funds`);

    return { senderAccount, receiverAccount };
}

/**
 * Defines the steps involved in processing a transaction based on its type.
 * 
 * @param {string} type - The type of the transaction (e.g., 'outgoing', 'refund').
 * @returns {Array} - An array of steps involved in the transaction process.
 */
function getDistrebutionSteps(type) {
    switch (type) {
        case 'outgoing':
            // Steps for an outgoing transaction
            return [
                { completed: false, api: 'riskAnalysis', endpoint: '$external/riskAnalysis', response: {} },
                { completed: false, api: 'fraudDetection', endpoint: '$external/fraudDetection', response: {} },
                { completed: false, api: 'paymentConfirmation', endpoint: '$external/paymentConfirmation', response: {} },
                { completed: false, api: 'paymentStatus', endpoint: '$external/paymentStatus', response: {} }
            ];
        case 'refund':
            // Steps for a refund transaction
            return [
                { completed: false, api: 'paymentRefund', endpoint: '$external/paymentRefund', response: {} },
                { completed: false, api: 'refundConfirmation', endpoint: '$external/fraudDetection', response: {} },
                { completed: false, api: 'paymentStatus', endpoint: '$external/paymentStatus', response: {} }
            ];
        default:
            // Default steps (similar to outgoing)
            return [
                { completed: false, api: 'riskAnalysis', endpoint: '$external/riskAnalysis', response: {} },
                { completed: false, api: 'fraudDetection', endpoint: '$external/fraudDetection', response: {} },
                { completed: false, api: 'paymentConfirmation', endpoint: '$external/paymentConfirmation', response: {} },
                { completed: false, api: 'paymentStatus', endpoint: '$external/paymentStatus', response: {} }
            ];
    }
}


/**
 * Adds a new transaction to the database and links it to a user.
 * 
 * @param {string} userId - The ID of the user initiating the transaction.
 * @param {Object} transaction - The transaction details.
 * @returns {Promise<Object>} - A promise that resolves to the added transaction object.
 */
async function add(userId, transaction) {
    try {
        // Retrieve the encrypted 'transactions' collection
        const { collection, session } = await dbService.getEncryptedCollection('transactions', serviceName, encryptedFieldsMap);
        
        // Fetch the user initiating the transaction
        const user = await userService.getById(userId);
        if (!user) throw new Error(`user ${userId} not found`);

        // Set initial transaction details
        transaction.date = Date.now();
        transaction.status = 'pending';
        transaction.type = 'outgoing';
        transaction.steps = getDistrebutionSteps(transaction.type);

        // Validate the transaction initiation
        const { receiver } = transaction.referenceData;
        const sender = { "userId": user._id, "accountId": transaction.accountId };
        const { senderAccount, receiverAccount } = await validateTrasactionInitiate(sender, receiver, transaction.amount);

        // Update transaction with receiver and sender details
        transaction.referenceData = {
            ...transaction.referenceData,
            receiver: {
                ...transaction.referenceData.receiver,
                name: receiverAccount.user.username,
                accountNumber: receiverAccount.accountNumber
            },
            sender: {
                ...transaction.referenceData.sender,
                accountId: senderAccount._id,
                name: senderAccount.user.username,
                accountNumber: senderAccount.accountNumber
            }
        };

          // Update transaction with receiver and sender details
          transaction.referenceData = {
            ...transaction.referenceData,
            receiver: {
                ...transaction.referenceData.receiver,
                name: receiverAccount.user.username,
                accountNumber: receiverAccount.accountNumber
            },
            sender: {
                accountId: senderAccount._id,
                name: senderAccount.user.username,
                userId: user._id,
                accountNumber: senderAccount.accountNumber
            }
        };

        // Insert the transaction into the collection
        const addedTransaction = await collection.insertOne(transaction, { session });
        transaction.txId = addedTransaction.insertedId;

        // Update the user's transaction history
        const users = await dbService.getEncryptedCollection('users', serviceName);
        await userService.addTransaction(userId, transaction, users.collection, session);

        // Clean up sensitive data before returning
        delete transaction.referenceData.sender.accountNumber;
        delete transaction.referenceData.receiver.accountNumber;

        return transaction;
    } catch (err) {
        // Abort the transaction in case of an error
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        logger.error(`transaction.service.js-add: cannot insert transaction`, err);
        throw err;
    }
}

function cleanTransaction(transaction) {
   delete transaction.referenceData.sender.accountNumber;
    delete transaction.referenceData.receiver.accountNumber;
    delete transaction.details;

    return transaction;
}

// status update
/**
 * Updates the steps and status of a transaction based on the provided steps.
 * 
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {Array} steps - An array of steps involved in the transaction process.
 * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
 */
async function update(transactionId, steps) {
    try {
        // Retrieve the encrypted 'transactions' collection
        const { collection } = await dbService.getEncryptedCollection('transactions', serviceName);

        // Prepare the object to be saved
        let transactionToSave = { steps };

        // Check if all steps are completed
        const isCompleted = steps.every(step => step.completed);
        if (isCompleted) {
            // Update the status to 'completed' if all steps are completed
            transactionToSave.status = 'completed';
            //update reciever user
            let transaction = await collection.findOne({ _id: new ObjectId(transactionId) });
            const receiver = transaction.referenceData.receiver;
            const sender = transaction.referenceData.sender;
            transaction.type = 'incoming';
            transaction.status = 'completed';
            
            transaction = cleanTransaction(transaction);

            // Update users with  transaction details
            await userService.addTransaction(receiver.userId, transaction)
            await userService.addTransaction(sender.userId, transaction)
            
            

        }

        // Update the transaction in the collection
        await collection.updateOne({ _id: new ObjectId(transactionId) }, { $set: transactionToSave });

        // Note: The session is not used here for the transaction, remove if unnecessary
    } catch (err) {
        // Log and throw the error for further handling
        logger.error(`transaction.service.js-update: cannot update transaction ${transactionId}`, err);
        throw err;
    }
}

function _buildCriteria(query) {
    let criteria = {};

    if (query.status) {
        criteria.status = query.status;
    }
    if (query.amount) {
        criteria.amount = parseFloat(query.amount);
    }
    if (query.dateFrom && query.dateTo) {
        criteria.date = { $gte: new Date(query.dateFrom), $lte: new Date(query.dateTo) };
    }
    //referenceData queries
    if (query.senderAccountNumber) {
        criteria['referenceData.sender.accountNumber'] = query.senderAccountNumber;
    }
    if (query.receiverAccountNumber) {
        criteria['referenceData.receiver.accountNumber'] = query.receiverAccountNumber;
    }

    return criteria;
}



module.exports = {
    query,
    getById,
    add,
    update
}









