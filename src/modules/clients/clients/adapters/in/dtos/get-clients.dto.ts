import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { ClientState } from 'src/shared/enums/project';

@InputType()
export class GetClientsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsEnum(ClientState)
  state!: ClientState;
}
