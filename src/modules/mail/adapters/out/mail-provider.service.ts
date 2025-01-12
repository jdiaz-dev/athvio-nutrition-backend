import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';

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
