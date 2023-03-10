import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteClientPlanDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsMongoId()
  clientPlanId: string;
}
