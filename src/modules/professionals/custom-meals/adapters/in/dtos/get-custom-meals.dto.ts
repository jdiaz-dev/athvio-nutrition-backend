import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';

@InputType()
export class GetCustomMealsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professionalId: string;
}
