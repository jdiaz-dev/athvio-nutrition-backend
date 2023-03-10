import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ManageClientGroup } from 'src/shared/enums/project';

@InputType()
export class ManageClientGroupDto {
  @Field()
  @IsString()
  clientId!: string;

  @Field()
  @IsString()
  groupId!: string;

  @Field()
  @IsEnum(ManageClientGroup)
  action!: string;
}
