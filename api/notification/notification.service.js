const dbService = require('../../services/db.service')
// const transactionService = require('../transaction/transaction.service')
const socketService = require('../../services/socket.service')
const userService = require('../user/user.service')

const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

const serviceName = 'NOTIFICATION_MANAGEMENT'

let isWatchRunning = false;
let resumeToken = null;

/**
 * Listens to the 'notification' collection for new inserts and processes each notification.
    
 */

async function listenToNotification() {
    try {
        // Retrieve the 'notification' collection
        const { collection } = await dbService.getCollection('notifications', serviceName);
        // Start watching the collection for changes
        console.log('listening to notification')
        const changeStream = collection.watch([], { resumeAfter: resumeToken });
        isWatchRunning = true;

   

        // Handle each change in the collection
        changeStream.on('change', async(next) => {
            // Save the resume token
            resumeToken = next._id;

            // Process only 'insert' operations
            if (next.operationType === 'insert') {
                const notification = next.fullDocument;

                const user = await userService.getByUsername(notification.username);
                notification.userId = user._id;

                // Send socket notification

                socketService.emitToUser({
                    type: 'add-notification',
                    data: notification,
                    userId: notification.userId,
                });
                


                logger.info('notification.service.js-listenToNotification: emiting notification', notification._id);
               
            }
        });

        changeStream.on('error', err => {
            // Handle errors and restart the change stream
            logger.error('notification.service.js-listenToNotification: Error in change stream', err);
            isWatchRunning = false;
            setTimeout(listenToNotification, 1000); // Restart after a delay
        });
    } catch (err) {
        // Log error if the stream setup fails
        logger.error('notification.service.js-listenToNotification: cannot find notification', err);
        throw err;
    }
}

listenToNotification();

/**
 * Checks if the change stream for notification is running.
 * 
 * @returns {boolean} - True if the change stream is running, false otherwise.
 */

function isRunning() {
    return isWatchRunning;
}

/**
 * Adds a new notification to the collection.
 * 
 * @param {Array} notifications - The notifications to add.
 * @returns {Promise<Object>} - A promise that resolves to the added notification.
 */
async function  sendNotification(notifications) {
    const { collection } = await dbService.getCollection('notifications', serviceName);
    try {
        // Insert the notification to the collection
        const result = await collection.insertMany(notifications);
        return result;
    } catch (err) {
        logger.error('notification.service.js-add: cannot insert notification', err);
        throw err;
    }
}



module.exports = {
    isRunning,
    sendNotification
}

