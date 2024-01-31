const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const logger = require('./logger.service');
const qeHelper = require('./queryEncryption.service'); // Import the encryption helper

module.exports = {
    getCollection,
    getEncryptedCollection
};

var dbConnections = {};
var encryptedDbConnections = {};

/**
 * Retrieves a regular MongoDB collection.
 * 
 * @param {string} collectionName - The name of the collection to retrieve.
 * @param {string} service - The service identifier for the database connection.
 * @returns {Promise<{collection: Object, session: Object}>} - An object containing the collection and session.
 */
async function getCollection(collectionName, service, atlasSearchIndex) {
    // Connect to the database
    const { db, session } = await connect(service, atlasSearchIndex,collectionName);

    // Retrieve the specified collection
    const collection = db.collection(collectionName);

    return { collection, session };
}

/**
 * Retrieves an encrypted MongoDB collection.
 * 
 * @param {string} collectionName - The name of the encrypted collection to retrieve.
 * @param {string} service - The service identifier for the encrypted database connection.
 * @param {Object} encryptedFieldsMap - Map of fields to be encrypted.
 * @returns {Promise<{collection: Object, session: Object}>} - An object containing the encrypted collection and session.
 */
async function getEncryptedCollection(collectionName, service, encryptedFieldsMap, atlasSearchIndex) {
    // Define encryption configuration
    const encryptionConfig = {
        kmsProviderName: 'local',
        keyVaultDatabaseName: '_encrypt',
        keyVaultCollectionName: 'datakeys',
        encryptedDatabaseName: 'FSI',
        encryptedCollectionName: collectionName
    };

    // Connect to the encrypted database
    const { db, session } = await encryptedConnect(service, encryptionConfig, encryptedFieldsMap, atlasSearchIndex);

    // Retrieve the specified encrypted collection
    const collection = db.collection(collectionName);

    // Optional logging for debugging purposes
    console.log(`getEncryptedCollection: collectionName: ${collectionName}`);

    return { collection, session };
}



/**
 * Asynchronously establishes a database connection for a given service.
 * Reuses existing connections if available to avoid redundant connections.
 * 
 * @param {string} service - The service identifier used to manage connections.
 * @returns {Promise<{db: Object, session: Object}>} - An object containing the database instance and session.
 */
async function connect(service, atlasSearchIndex, collectionName) {
    // Check if a connection already exists for the service and return it if present
    if (dbConnections[service]) {
        const session = dbConnections[service].startSession();
        return { db: dbConnections[service].db(config.dbName), session };
    }

    try {
        // Retrieve database credentials from environment variables
        const username = process.env[`${service}_USR`];
        const password = process.env[`${service}_PWD`];
        // Construct the MongoDB connection URL
        const dbURL = `mongodb+srv://${username}:${password}@${config.dbCluster}/${config.dbName}?retryWrites=true&w=majority`;

        // Connect to MongoDB with recommended options
        const client = await MongoClient.connect(dbURL);
        const db = client.db(config.dbName);

        // create index for atlas search
        if (atlasSearchIndex) {
        try {
            const index = {
                name: "default",
                definition: atlasSearchIndex
                }
            
            // run the helper method
            const result = await db.collection(collectionName).createSearchIndex(index);
            logger.info(`Created Atlas Search Index: ${result}`);
        } catch (err) {
            logger.warn(`db.service.js-connect: Cannot Create Atlas Search Index for ${service}`, err);
        }
    }

        // Store the connection for future reuse
        dbConnections[service] = client;

        // Start a new session and return the database and session
        const session = client.startSession();
        return { db, session };
    } catch (err) {
        // Log the error and rethrow it for handling upstream
        logger.error(`db.service.js-connect: Cannot Connect to DB for ${service}`, err);
        throw err;
    }
}


/**
 * Asynchronously establishes an encrypted connection to a specified service.
 * 
 * @param {string} service - The service to connect to.
 * @param {Object} encryptionConfig - Configuration parameters for encryption.
 * @param {Object} encryptedFieldsMap - Map of fields to be encrypted.
 * @returns {Promise<{db: Object, session: Object}>} - The database object and session.
 */
async function encryptedConnect(service, encryptionConfig, encryptedFieldsMap) {
    // Check if a connection already exists for the service and return it if present
    if (encryptedDbConnections[service]) {
        const session = encryptedDbConnections[service].startSession();
        return { db: encryptedDbConnections[service].db(config.dbName), session };
    }

    try {
        // Set up encryption configuration
        const keyVaultNamespace = `${encryptionConfig.keyVaultDatabaseName}.${encryptionConfig.keyVaultCollectionName}`;
        const kmsProviderCredentials = qeHelper.getKMSProviderCredentials(encryptionConfig.kmsProviderName);
        console.log(`Setting up auto encryption options fror service ${service}`)
        // Retrieve auto encryption options
        const autoEncryptionOptions = await qeHelper.getAutoEncryptionOptions(
            encryptionConfig.kmsProviderName,
            keyVaultNamespace,
            kmsProviderCredentials
        );

        // Retrieve database credentials from environment variables
        const username = process.env[`${service}_USR`];
        const password = process.env[`${service}_PWD`];
        const dbURL = `mongodb+srv://${username}:${password}@${config.dbCluster}/${config.dbName}?retryWrites=true&w=majority`;

        // Initialize Key Vault client
        const keyVaultClient = new MongoClient(dbURL);
        await keyVaultClient.connect();
        const keyVaultDB = keyVaultClient.db(encryptionConfig.keyVaultDatabaseName);
        const keyVaultColl = keyVaultDB.collection(encryptionConfig.keyVaultCollectionName);

        // Create an index on the keyAltNames field
        await keyVaultColl.createIndex({ keyAltNames: 1 }, { unique: true, partialFilterExpression: { keyAltNames: { $exists: true } } });

        console.log(`Connected to cluster: ${config.dbCluster} with service ${service}`);
        console.log(`Connected to database: ${config.dbName}`);

        // Initialize client encryption
        const clientEncryption = qeHelper.getClientEncryption(keyVaultClient, autoEncryptionOptions);
        autoEncryptionOptions.keyVaultNamespace = keyVaultNamespace;
        autoEncryptionOptions.encryptedFieldsMap = encryptedFieldsMap;

        // Connect to the encrypted client
        const encClient = new MongoClient(dbURL, { autoEncryption: autoEncryptionOptions });
        await encClient.connect();
        const newEncDB = encClient.db(encryptionConfig.encryptedDatabaseName);

        // Create encrypted collection
        await qeHelper.createEncryptedCollection(clientEncryption, newEncDB, encryptionConfig.encryptedCollectionName, encryptionConfig.kmsProviderName, encryptedFieldsMap);

 

        // Store the connection and return it
        encryptedDbConnections[service] = encClient;
        const session = encClient.startSession();
        return { db: newEncDB, session };
    } catch (err) {
        // Log and rethrow the error
        logger.error(`db.service.js-encryptedConnect: Cannot Connect to Encrypted DB for ${service}`, err);
        throw err;
    }
}

