import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, IsString, ValidateNested, IsEnum } from 'class-validator';
import { OptionType } from 'src/shared/adapters/database/schemas/questionary-base.schema';

registerEnumType(OptionType, {
  name: 'OptionType',
});
@InputType()
class CreateCustomQuestionaryDetailInput {
  @Field()
  @IsString()
  fieldName: string;

  @Field()
  @IsString()
  associatedQuestion: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;

  @Field(() => OptionType)
  @IsEnum(OptionType)
  optionType: OptionType;
}

@InputType()
export class AddCustomQuestionaryDetailsDto {
  @Field()
  @IsUUID(4)
  questionary: string;

  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsString()
  questionaryGroup: string;

  @Field(() => [CreateCustomQuestionaryDetailInput])
  @ValidateNested()
  @Type(() => CreateCustomQuestionaryDetailInput)
  questionaryDetailsInput: CreateCustomQuestionaryDetailInput[];
}
