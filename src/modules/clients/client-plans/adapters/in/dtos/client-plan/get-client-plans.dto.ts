import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetClientPlansDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  clientId: string;
}
