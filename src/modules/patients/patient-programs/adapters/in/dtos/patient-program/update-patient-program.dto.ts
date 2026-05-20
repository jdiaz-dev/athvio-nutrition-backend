import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@InputType()
export class UpdatePatientProgramDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;
}
