import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProfesionalInfoDto {
  @Field({ nullable: true })
  @IsString()
  businessName: string;
}
