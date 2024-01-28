import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsBoolean } from 'class-validator';
import { CreateProfesionalInfoDto } from 'src/shared/dtos/create-professional-info.dto';

@InputType()
export class SignUpProfessionalDto {
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  countryCode!: string;

  @Field({ nullable: true })
  @IsString()
  country: string;

  @Field()
  @IsString()
  phone!: string;

  @Field()
  @IsBoolean()
  acceptedTerms: boolean;

  @Field()
  @ValidateNested()
  @Type(() => CreateProfesionalInfoDto)
  professionalInfo: CreateProfesionalInfoDto;
}
