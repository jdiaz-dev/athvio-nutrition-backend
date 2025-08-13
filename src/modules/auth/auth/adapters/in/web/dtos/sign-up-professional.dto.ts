import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsBoolean, IsOptional, IsStrongPassword, IsNumber, IsEnum } from 'class-validator';
import { CreateProfesionalInfoDto } from 'src/shared/dtos/create-professional-info.dto';
import { SupportedLanguages } from 'src/shared/enums/project';

@InputType()
export class SignUpProfessionalDto {
  @Field()
  @IsString()
  firstname: string;

  @Field()
  @IsString()
  lastname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @Field({ nullable: true }) //if it is optional attribute, it is mandatory add {nullable: true} or it will happend a infinite loop
  @IsString()
  @IsOptional()
  countryCode!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  acceptedTerms!: boolean;

  @Field(() => CreateProfesionalInfoDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfesionalInfoDto)
  professionalInfo!: CreateProfesionalInfoDto;

  @Field()
  @IsNumber()
  clientOffsetMinutes: number;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  detectedLanguage: SupportedLanguages;
}
