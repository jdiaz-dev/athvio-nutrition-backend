import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsBoolean, IsOptional, IsAlphanumeric } from '@nestjs/class-validator';
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
  @IsAlphanumeric()
  password: string;

  @Field({ nullable: true }) //if it is optional attribute, it is mandatory add {nullable: true} or it will happend a infinite loop
  @IsString()
  @IsOptional()
  countryCode!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country: string;

  @Field()
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
  professionalInfo: CreateProfesionalInfoDto;
}
