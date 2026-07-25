// file path: scratch/cleanup.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://demo:demo123@cluster.mongodb.net/my_app_database?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("my_app_database");

  const heroDocs = await db
    .collection("users")
    .find({
      $or: [{ email: "admin_hero_video@app.local" }, { type: "hero_video" }],
    })
    .sort({ createdAt: -1 })
    .toArray();

  console.log("Found hero docs:", heroDocs.length);
  if (heroDocs.length > 1) {
    const toDelete = heroDocs.slice(1).map((d) => d._id);
    await db.collection("users").deleteMany({ _id: { $in: toDelete } });
    console.log("Cleaned old hero video docs:", toDelete.length);
  }

  const secDocs = await db
    .collection("users")
    .find({
      $or: [{ email: "admin_secondary_video@app.local" }, { type: "secondary_video" }],
    })
    .sort({ createdAt: -1 })
    .toArray();

  console.log("Found secondary docs:", secDocs.length);
  if (secDocs.length > 1) {
    const toDelete = secDocs.slice(1).map((d) => d._id);
    await db.collection("users").deleteMany({ _id: { $in: toDelete } });
    console.log("Cleaned old secondary video docs:", toDelete.length);
  }

  await client.close();
  console.log("Cleanup complete!");
}

run().catch(console.error);
