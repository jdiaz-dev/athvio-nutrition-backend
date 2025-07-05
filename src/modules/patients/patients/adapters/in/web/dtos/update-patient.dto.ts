import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsEnum, IsUUID, IsBoolean, ValidateNested, IsOptional } from 'class-validator';
import { AllowedGender } from 'src/shared/enums/project';

@InputType()
class UpdateUserInfoDto {
  @Field()
  @IsUUID(4)
  user: string;

  @Field()
  @IsString()
  password!: string;

  @Field()
  @IsBoolean()
  acceptedTerms!: boolean;
}

//class destined for app
@InputType()
export class UpdatePatientMobileDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @ValidateNested()
  @Type(() => UpdateUserInfoDto)
  updateUserInfo: UpdateUserInfoDto;

  @Field()
  @IsString()
  location!: string;

  @Field()
  @IsString()
  timezone!: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  height!: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  weight!: number;

  @Field()
  @IsDate()
  birthday!: Date;

  @Field({ nullable: true })
  @IsEnum(AllowedGender)
  @IsOptional()
  gender!: AllowedGender;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  codeCountry!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone!: string;
}
