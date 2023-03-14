import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetClientGroupsDto {
  @Field()
  @IsMongoId()
  professionalId: string;
}
