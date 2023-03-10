import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ClientState } from 'src/shared/enums/project';

@InputType()
export class ManageClientStateDto {
  @Field()
  @IsString()
  clientId: string;

  @Field()
  @IsEnum(ClientState)
  state: string;
}
