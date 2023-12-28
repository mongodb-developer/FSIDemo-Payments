const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const http = require('http').createServer(app);

// Express App Configuration
app.use(cookieParser()); // Middleware for parsing cookies
app.use(express.json()); // Middleware for parsing JSON bodies

// Allow cors
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
    credentials: true // enable set cookie
}));

// Import routes
const userRoutes = require('./api/user/user.routes');
const accountRoutes = require('./api/account/account.routes');
const transactionRoutes = require('./api/transaction/transaction.routes');
const paymentRoutes = require('./api/payment/payment.routes');

// Setting up routes
app.use('/api/user', userRoutes); // User related routes
app.use('/api/account', accountRoutes); // Account related routes
app.use('/api/transaction', transactionRoutes); // Transaction related routes
app.use('/api/payment', paymentRoutes); // Payment related routes

// Logger service for logging messages
const logger = require('./services/logger.service');

// Server port configuration
const port = process.env.PORT || 3030;

// Starting the server
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
