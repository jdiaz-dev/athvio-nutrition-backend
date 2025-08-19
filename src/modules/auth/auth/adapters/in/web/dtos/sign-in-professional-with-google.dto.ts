import { InputType } from '@nestjs/graphql';
import { SignUpProfessionalWithGoogleDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional-with-google.dto';

@InputType()
export class SignInProfessionalWithGoogleDto extends SignUpProfessionalWithGoogleDto {}
