import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';
import { ClientState } from 'src/shared/enums/project';

@InputType()
export class GetClientsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsEnum(ClientState)
  state!: ClientState;
}

@ObjectType()
export class GetClientsResponse extends GetRecordsResponse {
  @Field(() => [Client])
  data: Client[];
}
