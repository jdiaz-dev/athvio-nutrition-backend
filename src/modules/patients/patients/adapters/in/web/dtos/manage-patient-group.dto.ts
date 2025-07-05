import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { ManagePatientGroup } from 'src/shared/enums/project';

@InputType()
export class ManagePatientGroupDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  patient!: string;

  @Field()
  @IsUUID()
  patientGroup!: string;

  @Field()
  @IsEnum(ManagePatientGroup)
  action!: ManagePatientGroup;
}
