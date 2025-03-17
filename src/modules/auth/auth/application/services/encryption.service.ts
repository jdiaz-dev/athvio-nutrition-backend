import * as bcryptjs from 'bcryptjs';

export class EncryptionService {
  public static encrypt(data: string): string {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(data, salt);
  }
}
