
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);


const database = client.db('Challenge_1')

module.exports = {database}