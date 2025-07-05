import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetProgramsDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID()
  professional: string;
}

@ObjectType()
export class GetProgramsResponse extends GetRecordsResponse {
  @Field(() => [Program])
  data: Program[];
}
