import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetPatientGroupsDto {
  @Field()
  @IsUUID(4)
  professional: string;
}
