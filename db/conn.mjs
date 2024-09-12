import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.ATLAS_URI);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");

await db.collection("grades").createIndex({ class_id: 1 });
await db.collection("grades").createIndex({ learner_id: 1 });
await db.collection("grades").createIndex({ learner_id: 1, class_id: 1 });

(async () => {
  await db.command({
    collMod: "grades",
    // Pass the validator object
    validator: {
      // Use the $jsonSchema operator
      $jsonSchema: {
        bsonType: "object",
        title: "Learner Validation",
        // List required fields
        required: ["class_id", "learner_id"],
        // Properties object contains document fields
        properties: {
          class_id: {
            bsonType: "int",
            minimum: 0,
	    maximum: 300,
          },
	  learner_id: {
	    bsonType: "int",
	    minimum: 0,
	  },
        },
      },
    },
  });
})();

// fails verification
// db.collection("grades").insertOne({ class_id: 1 });

export default db;
