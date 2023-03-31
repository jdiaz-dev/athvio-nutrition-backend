import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManageClientGroup } from 'src/shared/enums/project';

@InputType()
export class ManageClientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  client!: string;

  @Field()
  @IsMongoId()
  clientGroup!: string;

  @Field()
  @IsEnum(ManageClientGroup)
  action!: ManageClientGroup;
}
