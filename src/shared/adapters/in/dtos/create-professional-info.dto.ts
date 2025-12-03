import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProfesionalInfoDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company!: string;
}
