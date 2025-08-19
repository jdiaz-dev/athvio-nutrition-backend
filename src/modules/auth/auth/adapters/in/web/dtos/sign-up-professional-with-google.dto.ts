import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { SupportedLanguages } from 'src/shared/enums/project';

@InputType()
export class SignUpProfessionalWithGoogleDto {
  @Field()
  idToken: string;

  @Field()
  @IsNumber()
  clientOffsetMinutes: number;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  detectedLanguage: SupportedLanguages;
}
