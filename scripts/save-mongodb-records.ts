import fs from 'fs';
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

const bucketName = 'mongodb-system-records';
const filePaths = [
  {
    path: '/home/polsito/Mongodb/athvio.NutritionalMeals.json',
    fileName: 'athvio.NutritionalMeals.json',
  },
  {
    path: '/home/polsito/Mongodb/athvio.Programs.json',
    fileName: 'athvio.Programs.json',
  },
  {
    path: '/home/polsito/Mongodb/athvio.InternalFoods.json',
    fileName: 'athvio.InternalFoods.json',
  },
];
async function saveRecords() {
  const promises: Promise<PutObjectCommandOutput>[] = [];
  try {
    for (let x = 0; x < filePaths.length; x++) {
      const fileContent = fs.readFileSync(filePaths[x].path);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePaths[x].fileName,
        Body: fileContent,
      });

      const s3client = new S3Client({
        region: process.env.REGION,
      });
      promises.push(s3client.send(command));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error('Error saving records to S3', error);
  }
}

saveRecords();
