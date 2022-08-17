const mongoClient = require("../config/database");
const getCollectionWithSchema = require("./collectionWithSchema");

const db = mongoClient.db("usersDatabase");

const storySchema = {
    title: "user",
    required: [
        "title",
        "body",
        "status",
        "authorId",
    ],
    properties: {
        title: {bsonType: "string"},
        body: {bsonType: "string"},
        status: {bsonType: "string", enum: ["public", "private"]},
        authorId: {bsonType: "objectId"},
        createdAt: {bsonType: "date"},
    }
};

const storyCollectionName = "stories";
module.exports = getCollectionWithSchema(db, storyCollectionName, storySchema);