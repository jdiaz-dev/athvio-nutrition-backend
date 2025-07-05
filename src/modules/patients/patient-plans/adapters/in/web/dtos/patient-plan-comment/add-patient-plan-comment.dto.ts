import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsUUID, IsString, ValidateNested } from 'class-validator';
import { CommenterType } from 'src/shared/enums/project';

@InputType()
export class CommenterInput {
  @Field()
  @IsUUID()
  commenterId!: string;

  @Field()
  @IsEnum(CommenterType)
  type!: CommenterType;
}

@InputType()
export class AddPatientPlanCommentDto {
  @IsUUID()
  @Field()
  patientPlanId: string;

  @IsUUID()
  @Field()
  patientId: string;

  @Field()
  @IsString()
  message: string;

  @Field(() => CommenterInput)
  @ValidateNested()
  @Type(() => CommenterInput)
  commenter: CommenterInput;
}
