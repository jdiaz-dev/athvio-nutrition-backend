import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetBiologicalTerrainAssesmentDto {
  @Field()
  @IsUUID(4)
  patient: string;
}
