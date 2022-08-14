const mongodb = require("mongodb");

let DB_CONNECTION_STRING;
if (process.env.MODE === "production") {
    DB_CONNECTION_STRING = process.env.MONGODB_URI_PRODUCTION;
} else {
    DB_CONNECTION_STRING = process.env.MONGODB_URI_DEVELOPMENT;
}

const mongoClient = new mongodb.MongoClient(DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverApi: mongodb.ServerApiVersion.v1,
});

mongoClient.connect();

module.exports = mongoClient;