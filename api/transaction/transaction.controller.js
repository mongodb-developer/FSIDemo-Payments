const transactionService = require('./transaction.service.js');
const logger = require('../../services/logger.service.js');

// Retrieve a list of transactions based on query criteria
async function getTransactions(req, res) {
    try {
        const criteria = req.query;
        const transactions = await transactionService.query(criteria);
        res.send(transactions);
    } catch (err) {
        logger.error(`transaction.controller.js-getTransactions: Failed to get transactions`, err);
        res.status(500).send({ err: 'Failed to get transactions' });
    }
}

// Retrieve a single transaction by ID
async function getTransaction(req, res) {
    try {
        const transaction = await transactionService.getById(req.params.id);
        res.send(transaction);
    } catch (err) {
        logger.error(`transaction.controller.js-getTransaction: Failed to get transaction`, err);
        res.status(500).send({ err: 'Failed to get transaction' });
    }
}

// Add a new transaction
async function addTransaction(req, res) {
    try {
        const transaction = req.body;
        const userId = req.params.userId;

        const savedTransaction = await transactionService.add(userId, transaction);
        res.send(savedTransaction);
    } catch (err) {
        logger.error(`transaction.controller.js-addTransaction: Failed to add transaction`, err);
        res.status(500).send({ err: 'Failed to add transaction' });
    }
}

// Update an existing transaction
async function updateTransaction(req, res) {
    try {
        const transaction = req.body;
        const updatedTransaction = await transactionService.update(req.params.id, transaction);
        res.send(updatedTransaction);
    } catch (err) {
        logger.error(`transaction.controller.js-updateTransaction: Failed to update transaction`, err);
        res.status(500).send({ err: 'Failed to update transaction' });
    }
}

// Delete a transaction
async function deleteTransaction(req, res) {
    try {
        await transactionService.remove(req.params.id);
        res.send({ msg: 'Transaction deleted successfully' });
    } catch (err) {
        logger.error(`transaction.controller.js-deleteTransaction: Failed to delete transaction`, err);
        res.status(500).send({ err: 'Failed to delete transaction' });
    }
}

// Refund a transaction
async function refundTransaction(req, res) {
    try {
        const updatedTransaction = await transactionService.refund(req.params.id);
        res.send(updatedTransaction);
    } catch (err) {
        logger.error(`transaction.controller.js-refundTransaction: Failed to refund transaction`, err);
        res.status(500).send({ err: 'Failed to refund transaction' });
    }
}

// Helper function to build query criteria from request parameters


module.exports = {
    getTransactions,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refundTransaction
};
