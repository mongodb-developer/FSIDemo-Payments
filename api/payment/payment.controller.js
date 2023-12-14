const {isRunning } = require('./payment.service')
const logger = require('../../services/logger.service')

async function checkRunning(req, res) {
    try {
        const isRunning = await isRunning();
        res.send({running : isRunning});
    } catch (err) {
        logger.error(`payment.controller.js-isRunning: Failed to get isRunning`, err);
        res.status(500).send({ err: 'Failed to get isRunning' });
    }
}

module.exports = {
    checkRunning
}