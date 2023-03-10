import { InputType } from '@nestjs/graphql';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetProgramsDto extends GetRecordsBaseDto {}
