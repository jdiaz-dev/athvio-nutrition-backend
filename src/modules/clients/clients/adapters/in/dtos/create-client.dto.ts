import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { AlloweGender } from 'src/shared/enums/project';

@InputType()
export class CreateUserInfoDto {
  @Field()
  firstName!: string;

  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsEmail()
  email!: string;
}

@InputType()
export class CreateClientDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @ValidateNested()
  @Type(() => CreateUserInfoDto)
  userInfo: CreateUserInfoDto;

  @Field()
  @IsString()
  @IsOptional()
  location!: string;

  @Field()
  @IsString()
  @IsOptional()
  timezone!: string;

  @Field()
  @IsNumber()
  @IsOptional()
  height!: number;

  @Field()
  @IsNumber()
  @IsOptional()
  weight!: number;

  @Field()
  @IsDate()
  @IsOptional()
  birthday!: Date;

  @Field()
  @IsEnum(AlloweGender)
  @IsOptional()
  gender!: string;

  @Field()
  @IsString()
  @IsOptional()
  profilePicture!: string;

  @Field()
  @IsString()
  @IsOptional()
  codeCountry!: string;

  @Field()
  @IsString()
  @IsOptional()
  phone!: string;

  @Field()
  @IsString()
  @IsOptional()
  target!: string;

  @Field()
  @IsString()
  limitation!: string;

  @Field()
  @IsString()
  notes!: string;
}
