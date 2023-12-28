const express = require('express')
const { getUser, getUsers, deleteUser, updateUser, addTransaction, updateLinkedAccounts, addUser, getUserByUsername } = require('./user.controller')
const router = express.Router()

// User routes
router.get('/', getUsers) // Get all users with optional filters
router.get('/:id', getUser) // Get a single user by ID
router.get('/username/:username', getUserByUsername) // Get a single user by username
router.put('/:id', updateUser) // Update a user's details
router.post('/register', addUser) // Add a new user

router.delete('/:id', deleteUser) // Delete a user

// Transaction and account management routes
router.post('/:id/transactions', addTransaction) // Add a transaction to a user's history
router.put('/:id/accounts', updateLinkedAccounts) // Update a user's linked accounts

module.exports = router
