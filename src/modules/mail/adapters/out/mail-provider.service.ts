// import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
export class EmailProviderService {
  public static sesClient = new SESv2Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  public static sendCommand = SendEmailCommand;
}
