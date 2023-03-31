import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateClientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  groupName: string;
}
