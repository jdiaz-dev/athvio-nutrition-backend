import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { AllowedGender } from 'src/shared/enums/project';

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
  @IsEnum(AllowedGender)
  @IsOptional()
  gender!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  countryCode!: string; //TODO: review if country is saved in database"

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country!: string;

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
export class SignUpPatientDto {
  @Field()
  @IsMongoId()
  professional: string;

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

@ObjectType()
export class CreateUserInfoResponse {
  @Field()
  firstName!: string;

  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsEmail()
  email!: string;
}

@ObjectType()
export class SignUpPatientResponse {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  professional: string;

  @Field(() => [PatientGroup])
  groups: string[];

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  timezone: string;

  @Field({ nullable: true })
  height: number;

  @Field({ nullable: true })
  weight: number;

  @Field({ nullable: true })
  birthday: Date;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  profilePicture: string;

  @Field({ nullable: true })
  phone: string;

  @Field(() => CreateUserInfoResponse)
  userInfo: CreateUserInfoResponse;
}
