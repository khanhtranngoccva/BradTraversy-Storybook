const mongodb = require("mongodb");

/**
 * @param db {mongodb.Db}
 * @param collectionName {string}
 * @param schema {object}
 * @returns {Promise<mongodb.Collection>} */
async function getCollectionWithSchema(db, collectionName, schema) {
    try {
        return await db.createCollection(collectionName, {
            validator: {
                $jsonSchema: schema,
            }
        });
    } catch (e) {
        const result = await db.command({
            collMod: collectionName, validator: {
                $jsonSchema: schema,
            }
        });
        return db.collection(collectionName);
    }
}

module.exports = getCollectionWithSchema;