const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors")
const mongodb = require("mongodb");

const app = express();

dotenv.config({path: path.join(__dirname, "config", "config.env")});

app.use("static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

let PORT, DB_CONNECTION_STRING;
if (process.env.MODE === "production") {
    DB_CONNECTION_STRING = process.env.MONGODB_URI_PRODUCTION;
} else {
    DB_CONNECTION_STRING = process.env.MONGODB_URI_DEVELOPMENT;
    PORT = 5000;
}

const mongoClient = new mongodb.MongoClient(DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverApi: mongodb.ServerApiVersion.v1,
});

async function activateServer(port) {
    return new Promise((resolve, reject) => {
        app.listen(port, () => resolve()).on("error", (e) => {
            reject(e);
        });
    });
}

async function startServer() {
    await mongoClient.connect();
    while (true) {
        try {
            await activateServer(PORT);
            console.log("Listening at port " + PORT);
            break;
        } catch (e) {
            PORT++;
        }
    }
}

startServer();