// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("yourDatabase");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
