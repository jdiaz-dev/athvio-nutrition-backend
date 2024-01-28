import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetCaloryDto {
  @Field()
  @IsMongoId()
  patientId!: string;

  @Field()
  @IsMongoId()
  caloryId!: string;
}
