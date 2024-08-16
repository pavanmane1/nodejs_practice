// mongoDB.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true, // Temporarily for debugging, remove in production
});

const databaseName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;
const secretkey = process.env.JWT_SECRET;

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB!");
        return client; // Return the MongoClient instance
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message || error);
        throw new Error('Could not connect to MongoDB.');
    }
}

async function closeMongoDBConnection() {
    try {
        await client.close();
        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error.message || error);
        throw new Error('Could not close MongoDB connection.');
    }
}

module.exports = {
    connectToMongo,
    closeMongoDBConnection,
    databaseName,
    collectionName,
    secretkey
};
