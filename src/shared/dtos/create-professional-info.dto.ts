import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProfesionalInfoDto {
  @Field({ nullable: true })
  @IsString()
  businessName: string;

  @Field({ nullable: true })
  @IsString()
  countryCode: string;

  @Field({ nullable: true })
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsString()
  country: string;
}
