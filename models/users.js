const mongoClient = require("../config/database");
const getCollectionWithSchema = require("./collectionWithSchema");

const userSchema = {
    title: "user",
    required: [
        "_id",
        "googleId",
        "displayName",
        "name",
        "status",
    ],
    properties: {
        _id: {bsonType: "objectId"},
        googleId: {bsonType: "string"},
        displayName: {bsonType: "string"},
        image: {bsonType: "string"},
        name: {bsonType: "object",
            required: ["familyName", "givenName"],
            properties: {
                familyName: {bsonType: "string"},
                givenName: {bsonType: "string"},
            }
        },
        status: {
            bsonType: "string",
            enum: ["private", "public"],
        },
        createdAt: {bsonType: "date"},
    },
};

const userCollectionName = "users";

const db = mongoClient.db("usersDatabase");
module.exports = getCollectionWithSchema(db, userCollectionName, userSchema);