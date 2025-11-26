import { IsString, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UploadDto } from 'src/shared/dtos/upload.dto';

@InputType()
export class UploadImageToDefaultMealDto extends UploadDto {
  @Field()
  @IsUUID(4)
  nutritionalMeal: string;

  @Field()
  @IsString()
  role: string;
}
