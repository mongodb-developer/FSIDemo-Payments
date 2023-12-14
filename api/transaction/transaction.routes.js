const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')

const { getTransactions, getTransaction, deleteTransaction, addTransaction, updateTransaction } = require('./transaction.controller')

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getTransactions)
router.get('/:id', getTransaction)
router.post('/:userId', addTransaction)
router.put('/:userId/:id', updateTransaction)
router.delete('/:userId/:id', deleteTransaction)


// router.delete('/:id', requireAuth, requireAdmin, removeCar)

// router.post('/:id/msg', requireAuth, addCarMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeCarMsg)

module.exports = router
