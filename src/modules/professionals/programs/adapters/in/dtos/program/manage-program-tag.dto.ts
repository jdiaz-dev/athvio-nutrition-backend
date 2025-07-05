import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { ManageProgramTags } from 'src/shared/enums/project';

@InputType()
export class ManageProgramTagDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  program: string;

  @Field()
  @IsUUID(4)
  programTag: string;

  @Field()
  @IsEnum(ManageProgramTags)
  action: string;
}
