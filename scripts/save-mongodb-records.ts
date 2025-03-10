import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const mongoURI = (process.env.MONGO_DB_CONNECTION as string) || '';
const collectionName = 'NutritionalMeals';

const bucketName = 'nutritional-meals-bucket';
const fileName = 'mongo_data.json';

async function saveRecords(records: any[]) {
  // Save records to a local file
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  });

  const s3client = new S3Client({
    region: process.env.REGION,
  });
  await s3client.send(command);
}

async function fetchMongoRecords(): Promise<void> {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db();
    const collection = db.collection(collectionName);
    const records = await collection.find({}).toArray();

    console.log('Fetched records:', records);
    await saveRecords(records);

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchMongoRecords();
