import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { ManageProgramTags } from 'src/shared/enums/project';

@InputType()
export class ManageProgramTagDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field()
  @IsUUID()
  programTag: string;

  @Field()
  @IsEnum(ManageProgramTags)
  action: string;
}
