const {checkRunning} = require('./notification.controller');
const logger = require('../../services/logger.service');
const express = require('express');

const router = express.Router();


router.get('/isRunning', checkRunning);
module.exports = router;
