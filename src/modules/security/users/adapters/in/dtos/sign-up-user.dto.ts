import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { CreateProfesionalInfoDto } from 'src/shared/dtos/create-professional-info.dto';

@InputType()
export class SignUpUserDto {
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
  @IsOptional()
  timezone!: string;

  @Field()
  @IsBoolean()
  acceptedTerms: boolean;

  @Field()
  @ValidateNested()
  @Type(() => CreateProfesionalInfoDto)
  professionalInfo: CreateProfesionalInfoDto;
}
