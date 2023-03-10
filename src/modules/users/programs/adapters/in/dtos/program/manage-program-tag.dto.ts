import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ManageProgramTags } from 'src/shared/enums/project';

@InputType()
export class ManageProgramTagDto {
  @Field()
  @IsString()
  programId: string;

  @Field()
  @IsString()
  programTagId: string;

  @Field()
  @IsEnum(ManageProgramTags)
  action: string;
}
