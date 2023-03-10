import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManageClientGroup } from 'src/shared/enums/project';

@InputType()
export class ManageClientGroupDto {
  @Field()
  @IsMongoId()
  clientId!: string;

  @Field()
  @IsMongoId()
  groupId!: string;

  @Field()
  @IsEnum(ManageClientGroup)
  action!: string;
}
