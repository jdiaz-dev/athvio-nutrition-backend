import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteClientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  clientGroup: string;
}
