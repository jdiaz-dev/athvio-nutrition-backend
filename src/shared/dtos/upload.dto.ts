import { InputType, Field } from '@nestjs/graphql';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';

@InputType()
export class UploadDto {
  @Field(() => UploadScalar)
  image: UploadScalar;
}
