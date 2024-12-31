import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';

export class EmailProviderService {
  public static sesClient = new SES({ region: process.env.REGION });
  public static sendCommand = SendRawEmailCommand;
}
