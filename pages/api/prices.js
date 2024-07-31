// pages/api/prices.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

async function fetchData() {
  const apiUrl = 'https://api.livecoinwatch.com/coins/map';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY
  };
  const body = JSON.stringify({
    "currency": "USD",
    "codes": ["ETH", "XRP", "BTC", "LTC", "BCH"],
    "sort": "rank",
    "order": "ascending",
    "offset": 0,
    "limit": 0,
    "meta": true
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: body
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }


  return response.json();
}


export default async function handler(req, res) {
  console.log("API Handler Called"); // Add a log to check if this is getting called
  try {
    await client.connect();
    const db = client.db("stockData");
    const prices = db.collection("prices");

    const data = await fetchData();
    
    const bulkOps = data.map(item => ({
      updateOne: {
        filter: { code: item.code },
        update: { $set: { price: Math.round(item.rate * 100) / 100, lastUpdated: new Date(), symbol: item.symbol || 'NA' } },
        upsert: true
      }
    }));

    // Perform bulk write
    const result = await prices.bulkWrite(bulkOps);
    console.log("Bulk write result:", result);

    const latestData = await prices.find({}).sort({ _id: -1 }).limit(20).toArray(); // Get the latest 20 entries

    res.status(200).json(latestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await client.close();
  }
}
