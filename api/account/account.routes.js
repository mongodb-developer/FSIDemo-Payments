const express = require('express')
const { addAccount, getAccounts, getAccount , deleteAccount, searchAccounts} = require('./account.controller')
const router = express.Router()

// Account service routes
router.get('/', getAccounts)
router.get('/:id', getAccount)
router.get('/fts/search', searchAccounts)
router.post('/', addAccount)
router.delete('/:id', deleteAccount)

module.exports = router