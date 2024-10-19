import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetDataPatientDto {
  @Field()
  @IsMongoId()
  patient: string;
}
