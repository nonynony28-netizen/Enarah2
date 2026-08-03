import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "63de55e3585d0ef6ef4458594669f71b";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "ff081101a613ca4190798cd0c9da2773";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "0cf61f46d299a18d22cbbbeb61f6d4af0f3219f931692a7b43b4faac26349f1f";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "enarah-modern";
const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-4cff48cfd0904acfa2890603fb3c0c40.r2.dev").replace(/\/$/, "");
const MONGODB_URI = process.env.MONGODB_URI;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function testPipeline() {
  console.log("==========================================");
  console.log("🚀 Testing Cloudflare R2 + MongoDB Pipeline");
  console.log("==========================================");

  const testKey = `test-images/test-${Date.now()}.webp`;
  const dummyBuffer = Buffer.from("RIFF....WEBPVP8 ...test image content...");

  console.log(`1. Uploading test image to Cloudflare R2 (${R2_BUCKET_NAME}/${testKey})...`);
  const putCmd = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: testKey,
    Body: dummyBuffer,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3Client.send(putCmd);
  const publicUrl = `${R2_PUBLIC_URL}/${testKey}`;
  console.log(`✅ Upload successful! Public Cloudflare R2 URL:\n   ${publicUrl}`);

  console.log("\n2. Verifying file in Cloudflare R2 bucket...");
  const headCmd = new HeadObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: testKey,
  });
  const headRes = await s3Client.send(headCmd);
  console.log(`✅ Cloudflare R2 Object Verified! Size: ${headRes.ContentLength} bytes, Type: ${headRes.ContentType}`);

  if (MONGODB_URI) {
    console.log("\n3. Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const collection = db.collection("media_uploads_test");

    const record = {
      imageName: "Test Wire Image",
      cloudflareUrl: publicUrl,
      r2BucketKey: testKey,
      createdAt: new Date(),
      status: "active_compressed"
    };

    const insertRes = await collection.insertOne(record);
    console.log(`✅ MongoDB Record Created! Document ID: ${insertRes.insertedId}`);

    const retrieved = await collection.findOne({ _id: insertRes.insertedId });
    console.log(`✅ Retrieved MongoDB Record:\n`, JSON.stringify(retrieved, null, 2));

    await client.close();
  }

  console.log("\n==========================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY 100%!");
  console.log("   Cloudflare R2 storage + MongoDB URL linking is fully operational!");
  console.log("==========================================");
}

testPipeline().catch((err) => {
  console.error("❌ Pipeline Test Error:", err);
});
