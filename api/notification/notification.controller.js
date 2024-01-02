const {isRunning } = require('./notification.service')
const logger = require('../../services/logger.service')

async function checkRunning(req, res) {
    try {
        const test = await isRunning();
        res.send({running : test});
    } catch (err) {
        logger.error(`payment.controller.js-isRunning: Failed to get isRunning`, err);
        res.status(500).send({ err: 'Failed to get isRunning' });
    }
}

module.exports = {
    checkRunning
}