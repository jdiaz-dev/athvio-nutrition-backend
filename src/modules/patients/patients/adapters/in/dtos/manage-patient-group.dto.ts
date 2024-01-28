import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ManagePatientGroup } from 'src/shared/enums/project';

@InputType()
export class ManagePatientGroupDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient!: string;

  @Field()
  @IsMongoId()
  patientGroup!: string;

  @Field()
  @IsEnum(ManagePatientGroup)
  action!: ManagePatientGroup;
}
