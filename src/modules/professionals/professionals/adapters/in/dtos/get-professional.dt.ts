import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetProfessionalDto {
  @Field()
  @IsUUID(4)
  professional: string;
}
