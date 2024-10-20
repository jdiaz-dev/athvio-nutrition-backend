import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetPatientForMobileDto {
  @Field()
  @IsMongoId()
  patient: string;
}
