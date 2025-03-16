import { IsMongoId } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UploadScalar } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.scalar';

@InputType()
export class UploadDto {
  @Field()
  @IsMongoId()
  nutritionalMeal: string;

  @Field(() => UploadScalar)
  image: UploadScalar;
}
