import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetProfessionalDto {
  @Field()
  @IsMongoId()
  professional: string;
}
