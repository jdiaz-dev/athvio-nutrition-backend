import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManageClientGroup } from 'src/shared/enums/project';

@InputType()
export class ManageClientGroupDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  clientId!: string;

  @Field()
  @IsMongoId()
  clientGroupId!: string;

  @Field()
  @IsEnum(ManageClientGroup)
  action!: ManageClientGroup;
}
