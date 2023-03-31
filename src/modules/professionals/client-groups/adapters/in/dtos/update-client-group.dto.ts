import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class UpdateClientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  clientGroup: string;

  @Field()
  @IsString()
  groupName: string;
}
