import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsBoolean, IsOptional, IsStrongPassword, IsNumber, IsEnum } from 'class-validator';
import { CreateProfesionalInfoDto } from 'src/shared/adapters/in/dtos/create-professional-info.dto';
import { SupportedLanguages } from 'src/shared/enums/project';

@InputType()
export class SignUpProfessionalDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastname?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password?: string;

  @Field({ nullable: true }) //if it is optional attribute, it is mandatory add {nullable: true} or it will happend a infinite loop
  @IsString()
  @IsOptional()
  countryCode?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  acceptedTerms?: boolean;

  @Field(() => CreateProfesionalInfoDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfesionalInfoDto)
  professionalInfo?: CreateProfesionalInfoDto;

  @Field()
  @IsNumber()
  clientOffsetMinutes: number;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  detectedLanguage: SupportedLanguages;
}
