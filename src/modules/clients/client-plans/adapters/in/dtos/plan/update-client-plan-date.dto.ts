import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId } from 'class-validator';

@InputType()
export class UpdateClientPlanDateDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  client: string;

  @Field()
  @IsMongoId()
  clientPlan: string;

  @Field()
  @IsDate()
  assignedDate: Date;
}
