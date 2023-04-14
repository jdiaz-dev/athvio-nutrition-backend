import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateClientPlanDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsMongoId()
  clientPlanId: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title: string;

  /*  @Field(() => [MealBodyInput], { nullable: true })
  @IsOptional()
  planMeals: [MealBodyInput]; */
}
