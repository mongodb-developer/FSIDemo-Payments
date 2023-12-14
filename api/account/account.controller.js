const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const accountService = require('./account.service')

/**
 * Handles the HTTP request to get a list of accounts based on query parameters.
 * 
 * @param {Object} req - The HTTP request object, containing query parameters.
 * @param {Object} res - The HTTP response object used for sending responses.
 */
async function getAccounts(req, res) {
    try {
        // Retrieve accounts using the query parameters provided in the request
        const accounts = await accountService.query(req.query);

        // Send the retrieved accounts back to the client
        res.send(accounts);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`account.controller.js-getAccounts: Cannot get accounts`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to get accounts' });
    }
}


async function getAccount(req, res) {
    try {
        const account = await accountService.getById(req.params.id)
        res.send(account)
    } catch (err) {
        // logger.error('Failed to get account', err)
        logger.error(`account.controller.js-getAccount: Failed to get account`, err)
        res.status(500).send({ err: 'Failed to get account' })
    }
}

/**
 * Handles the HTTP request to delete an account based on the provided ID.
 * 
 * @param {Object} req - The HTTP request object, containing the account ID in the parameters.
 * @param {Object} res - The HTTP response object used for sending responses.
 */
async function deleteAccount(req, res) {
    try {
        // Attempt to delete the account using the provided ID
        const deletedCount = await accountService.remove(req.params.id);

        // Check if the account was successfully deleted
        if (deletedCount === 1) {
            // Send a success message if the account was deleted
            res.send({ msg: 'Deleted successfully' });
        } else {
            // Send an error response if no account was deleted
            res.status(400).send({ err: 'Cannot remove account' });
        }
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`account.controller.js-deleteAccount: Failed to delete account`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to delete account' });
    }
}



/**
 * Handles the HTTP request to add a new account based on the provided user ID and account details.
 * 
 * @param {Object} req - The HTTP request object, containing the user ID and account details in the body.
 * @param {Object} res - The HTTP response object used for sending responses.
 */
async function addAccount(req, res) {
    try {
        // Extract the user ID and account details from the request body
        const { userId, accountDetails } = req.body;

        // Add the account and update the user's linked accounts
        const { savedAccount, updatedUser } = await accountService.add(userId, accountDetails);

        // Send the details of the saved account and the updated user back to the client
        res.send({ "account": savedAccount, "user": updatedUser });
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`account.controller.js-addAccount: Failed to add account`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to add account' });
    }
}


module.exports = {
    getAccounts,
    getAccount,
    deleteAccount,
    addAccount
}