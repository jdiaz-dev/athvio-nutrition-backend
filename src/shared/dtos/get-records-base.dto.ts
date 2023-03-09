import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString, Max } from 'class-validator';

@InputType()
export class GetRecordsBaseDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @IsInt()
  offset: number = 0;

  @Field({ nullable: true })
  @IsNumber()
  @IsInt()
  @Max(30)
  @IsOptional()
  limit: number = 30;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  orderBy!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search: string;
}

