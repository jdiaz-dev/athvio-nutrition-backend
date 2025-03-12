import fs from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucketName = 'nutritional-meals-bucket';
const fileName = 'mongo_data.json';

async function saveRecords() {
  const filePath = '/home/polsito/Mongodb/athvio.NutritionalMeals.json';
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

saveRecords();
