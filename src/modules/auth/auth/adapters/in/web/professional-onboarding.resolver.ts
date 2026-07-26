import { UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional-with-google.dto';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { SignUpProfessionalService } from 'src/modules/auth/auth/application/services/sign-up-professional.service';
import { SignUpProfessionalResponse } from 'src/modules/auth/auth/helpers/dtos/sign-up-profesional-response.dto';
import { GqlInterceptor } from 'src/shared/adapters/in/interceptors/gql.interceptor';

@Resolver()
export class ProfessionalOnboardingResolver {
  constructor(private sups: SignUpProfessionalService) {}

  @Mutation(() => SignUpProfessionalResponse)
  @UseInterceptors(GqlInterceptor)
  signUpProfessional(
    @Args('input') dto: SignUpProfessionalDto,
    @Context() _context: unknown,
  ): Promise<SignUpProfessionalResponse> {
    return this.sups.signUpProfessional(dto);
  }
  @Mutation(() => SignUpProfessionalResponse)
  @UseInterceptors(GqlInterceptor)
  signUpProfessionalWithGoogle(@Args('input') dto: SignUpProfessionalWithGoogleDto): Promise<SignUpProfessionalResponse> {
    return this.sups.signUpWithGoogle(dto);
  }
}
