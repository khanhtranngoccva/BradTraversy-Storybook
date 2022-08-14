const mongoClient = require("../config/database");

const userSchema = {
    title: "user",
    required: [
        "_id",
        "googleId",
        "displayName",
    ],
    properties: {
        _id: {bsonType: "objectId"},
        googleId: {bsonType: "string"},
        displayName: {bsonType: "string"},
        image: {bsonType: "string"},
        createdAt: {bsonType: "date"},
    },
};

const userCollectionName = "users";

const db = mongoClient.db("usersDatabase");

async function usersCollection() {
    try {
        return await db.createCollection(userCollectionName, {
            validator: {
                $jsonSchema: userSchema,
            }
        });
    } catch (e) {
        await db.command({collMod: userCollectionName}, {
            validator: {
                $jsonSchema: userSchema,
            }
        });
        return db.collection(userCollectionName);
    }
}

module.exports = usersCollection();