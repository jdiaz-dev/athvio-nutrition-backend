import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { ManagePatientGroup } from 'src/shared/enums/project';

@InputType()
export class ManagePatientGroupDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient!: string;

  @Field()
  @IsUUID(4)
  patientGroup!: string;

  @Field(() => String)
  @IsEnum(ManagePatientGroup)
  action!: ManagePatientGroup;
}
