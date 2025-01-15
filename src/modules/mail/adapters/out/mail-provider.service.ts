import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';

console.log('---------process.env.AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID)
console.log('---------process.env.AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY)
export class EmailProviderService {
  public static sesClient = new SES({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  public static sendCommand = SendRawEmailCommand;
}
