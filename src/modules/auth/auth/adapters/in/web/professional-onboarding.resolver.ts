import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';

import { SignUpProfessionalService } from 'src/modules/auth/auth/application/services/sign-up-professional.service';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';

@Resolver()
export class ProfessionalOnboardingResolver {
  constructor(private sups: SignUpProfessionalService) {}

  @Mutation(() => JwtDto)
  signUpProfessional(@Args('input') dto: SignUpProfessionalDto, @Context() _context: unknown): Promise<JwtDto> {
    return this.sups.signUpProfessional(dto);
  }
}
