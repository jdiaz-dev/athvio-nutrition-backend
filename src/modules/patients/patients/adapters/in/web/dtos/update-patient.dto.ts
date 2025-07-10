import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsDate, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { AllowedGender } from 'src/shared/enums/project';

//class destined for app
@InputType()
export class UpdatePatientMobileDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

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
}
