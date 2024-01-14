import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId } from 'class-validator';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';

@InputType()
export class DuplicateClientPlanDto {
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

  clientPlanToDuplicate?: ClientPlan;
}
