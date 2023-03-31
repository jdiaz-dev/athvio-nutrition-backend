import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManageProgramTags } from 'src/shared/enums/project';

@InputType()
export class ManageProgramTagDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  programTag: string;

  @Field()
  @IsEnum(ManageProgramTags)
  action: string;
}
