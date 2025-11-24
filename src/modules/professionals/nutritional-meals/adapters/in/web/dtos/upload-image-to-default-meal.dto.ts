import { IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';

@InputType()
export class UploadImageToDefaultMealDto extends UploadDto {
  @Field()
  @IsString()
  role: string;
}
