import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { ClientState } from 'src/shared/enums/project';

@InputType()
export class GetClientsDto extends GetRecordsBaseDto {
  @Field()
  @IsEnum(ClientState)
  state!: string;
}
