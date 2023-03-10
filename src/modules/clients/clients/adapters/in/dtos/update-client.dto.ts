import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNumber, IsDate, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { AlloweGender } from 'src/shared/enums/project';

@InputType()
export class UpdateClientDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  firstName!: string;

  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  location!: string;

  @Field()
  @IsString()
  timezone!: string;

  @Field()
  @IsNumber()
  height!: number;

  @Field()
  @IsNumber()
  weight!: number;

  @Field()
  @IsDate()
  birthday!: Date;

  @Field()
  @IsEnum(AlloweGender)
  gender!: string;

  @Field()
  @IsString()
  @IsOptional()
  profilePicture!: string;

  @Field()
  @IsString()
  codeCountry!: string;

  @Field()
  @IsString()
  phone!: string;

  @Field()
  @IsString()
  target!: string;

  @Field()
  @IsString()
  limitation!: string;

  @Field()
  @IsString()
  notes!: string;
}
