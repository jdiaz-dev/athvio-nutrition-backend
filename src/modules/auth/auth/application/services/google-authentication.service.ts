// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthErrorEnum } from 'src/modules/auth/auth/domain/auth-enum';

@Injectable()
export class GoogleAuthenticationService {
  private google = new OAuth2Client(process.env.OAUTH_GOOGLE_CLIENT_ID);

  constructor() {}

  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    const ticket = await this.google.verifyIdToken({
      idToken,
      audience: process.env.OAUTH_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new UnauthorizedException(AuthErrorEnum.INVALID_GOOGLE_TOKEN);
    }
    return payload;
  }

  async loginWithGoogle(idToken: string): Promise<TokenPayload> {
    const payload = await this.verifyGoogleIdToken(idToken);
    return payload;
  }
}
