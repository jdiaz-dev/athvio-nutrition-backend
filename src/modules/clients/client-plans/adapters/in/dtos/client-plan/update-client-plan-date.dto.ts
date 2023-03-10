import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId } from 'class-validator';

@InputType()
export class UpdateClientPlanDateDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsMongoId()
  clientPlanId: string;

  @Field()
  @IsDate()
  assignedDate: Date;
}
