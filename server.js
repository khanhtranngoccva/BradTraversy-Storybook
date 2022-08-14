const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path: path.join(__dirname, "config", "config.env")});

const express = require("express");

const app = express();
const mongoClient = require("./config/database");

const cors = require("cors");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

module.exports = {app, mongoClient};

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());



app.use(session({
    secret: "bongo cat",
    resave: false,
    saveUninitialized: false,
}));

require("./config/passport");

app.set("view engine", "ejs");

let PORT;
if (process.env.MODE !== "production") {
    PORT = 5000;
    app.use(morgan("dev"));
}

async function activateServer(port) {
    return new Promise((resolve, reject) => {
        app.listen(port, () => resolve()).on("error", (e) => {
            reject(e);
        });
    });
}
async function startServer() {
    while (true) {
        try {
            await activateServer(PORT);
            console.log("Listening at port " + PORT);
            break;
        } catch (e) {
            if (e.code === "EADDRINUSE") {
                PORT++;
            } else {
                throw e;
            }
        }
    }
}
startServer();