import { IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';

@InputType()
export class UploadDto {
  @Field()
  @IsUUID()
  nutritionalMeal: string;

  @Field(() => UploadScalar)
  image: UploadScalar;
}
