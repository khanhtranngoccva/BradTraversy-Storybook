const path = require("path");
const mongodb = require("mongodb");
require("dotenv").config({path: path.join(__dirname, "config", "config.env")});

const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URI_DEVELOPMENT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverApi: mongodb.ServerApiVersion.v1,
});

async function reset() {
    await mongoClient.connect();
    await mongoClient.db("usersData").dropDatabase();
    await mongoClient.close();
}

reset();
