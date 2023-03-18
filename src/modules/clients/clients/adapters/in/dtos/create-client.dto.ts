import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { AlloweGender } from 'src/shared/enums/project';

@InputType()
export class AdditionalInfoDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  location!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  timezone!: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  height!: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  weight!: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  birthday!: Date;

  @Field({ nullable: true })
  @IsEnum(AlloweGender)
  @IsOptional()
  gender!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  countryCode!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone!: string;

  /* @Field({ nullable: true })
  @IsString()
  @IsOptional()
  target!: string;

  @Field({ nullable: true })
  @IsString()
  limitation!: string;

  @Field({ nullable: true })
  @IsString()
  notes!: string; */
}

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

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  @Type(() => AdditionalInfoDto)
  additionalInfo: AdditionalInfoDto;
}
