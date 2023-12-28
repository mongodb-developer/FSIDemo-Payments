const userService = require('./user.service')
const logger = require('../../services/logger.service')

/**
 * Asynchronously retrieves a user based on the provided ID.
 * 
 * @param {Object} req - The request object, containing user ID in the parameters.
 * @param {Object} res - The response object used to send back the user data or error.
 */
async function getUser(req, res) {
    try {
        // Retrieve user by ID from the user service
        const user = await userService.getById(req.params.id);

        // Send the retrieved user data
        res.send(user);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-getUser: Failed to get user`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to get user' });
    }
}

async function getUserByUsername(req, res) {
    try {
        if (!req.params.username) throw new Error('Missing username')
        const user = await userService.getByUsername(req.params.username)
        res.send(user)
    } catch (err) {
        logger.error(`user.controller.js-getUserByUsername: Failed to get user`, err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}


/**
 * Asynchronously retrieves a list of users based on query parameters.
 * 
 * @param {Object} req - The request object, containing query parameters for filtering.
 * @param {Object} res - The response object used to send back the list of users or an error.
 */
async function getUsers(req, res) {
    try {
        // Extract the filter criteria from the query parameters
        const filterBy = req.query;

        // Query the users using the user service with the provided filter criteria
        const users = await userService.query(filterBy);

        // Send the retrieved list of users back to the client
        res.send(users);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-getUsers: Failed to get users`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to get users' });
    }
}


/**
 * Asynchronously adds a new user based on the request data.
 * 
 * @param {Object} req - The request object, containing the new user data in the body.
 * @param {Object} res - The response object used to send back the added user data or error.
 */
async function addUser(req, res) {
    try {
        // Extract the user data from the request body
        const user = req.body;

        // Add the user using the user service and await the saved user data
        const savedUser = await userService.add(user);

        // Send the saved user data back to the client
        res.send(savedUser);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-addUser: Failed to add user`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to add user' });
    }
}


async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        //logger.error('Failed to delete user', err)
        logger.error(`user.controller.js-deleteUser: Failed to delete user`, err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

/**
 * Asynchronously updates a user's data based on the request body.
 * 
 * @param {Object} req - The request object, containing the updated user data in the body.
 * @param {Object} res - The response object used to send back the updated user data or error.
 */
async function updateUser(req, res) {
    try {
        // Extract the user data from the request body
        const user = req.body;

        // Update the user using the user service and await the updated user data
        const savedUser = await userService.update(user);

        // Send the updated user data back to the client
        res.send(savedUser);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-updateUser: Failed to update user`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to update user' });
    }
}


/**
 * Asynchronously adds a transaction to a user's record based on the request data.
 * 
 * @param {Object} req - The request object, containing the user ID and transaction data in the body.
 * @param {Object} res - The response object used to send back the updated user data or error.
 */
async function addTransaction(req, res) {
    try {
        // Extract the user ID and transaction data from the request body
        const { userId, transaction } = req.body;

        // Add the transaction to the user's record using the user service
        const updatedUser = await userService.addTransaction(userId, transaction);

        // Send the updated user data back to the client
        res.send(updatedUser);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-addTransaction: Failed to add transaction`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to add transaction' });
    }
}


/**
 * Asynchronously updates linked account details for a specified user.
 * 
 * @param {Object} req - The request object, containing the user ID and account details in the body.
 * @param {Object} res - The response object used to send back the updated user data or error.
 */
async function updateLinkedAccounts(req, res) {
    try {
        // Extract the user ID and account details from the request body
        const { userId, accountDetails } = req.body;

        // Update the linked accounts for the user using the user service
        const updatedUser = await userService.updateLinkedAccounts(userId, accountDetails);

        // Send the updated user data back to the client
        res.send(updatedUser);
    } catch (err) {
        // Log the error for debugging and analysis purposes
        logger.error(`user.controller.js-updateLinkedAccounts: Failed to update linked accounts`, err);

        // Send a generic error message to the client
        res.status(500).send({ err: 'Failed to update linked accounts' });
    }
}

// Exporting the functions to make them available for import in other modules
module.exports = {
    getUser,
    getUsers,
    getUserByUsername,
    addUser,
    deleteUser,
    updateUser,
    addTransaction,
    updateLinkedAccounts
};
