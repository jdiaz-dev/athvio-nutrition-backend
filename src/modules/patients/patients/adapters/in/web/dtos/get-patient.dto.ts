import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetPatientForWebDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;
}
