import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ClientState } from 'src/shared/enums/project';

@InputType()
export class ManageClientStateDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsEnum(ClientState)
  state: string;
}
