import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ValidateUser } from 'src/modules/authentication/authentication/adapters/in/strategies/strategy.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('tokenKey'),
    });
  }
  validate({ user, ...rest }: ValidateUser): Record<string, string> {
    console.log('-----------rest', rest)
    return { user };
  }
}
