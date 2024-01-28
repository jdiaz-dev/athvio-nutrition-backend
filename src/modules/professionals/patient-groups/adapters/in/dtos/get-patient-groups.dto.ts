import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetPatientGroupsDto {
  @Field()
  @IsMongoId()
  professional: string;
}
