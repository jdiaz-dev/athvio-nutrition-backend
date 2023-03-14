import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManageProgramTags } from 'src/shared/enums/project';

@InputType()
export class ManageProgramTagDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsMongoId()
  programTagId: string;

  @Field()
  @IsEnum(ManageProgramTags)
  action: string;
}
