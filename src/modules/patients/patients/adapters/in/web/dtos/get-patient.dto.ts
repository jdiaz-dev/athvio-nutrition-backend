import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';

@InputType()
export class GetPatientForWebDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;
}

@ObjectType()
export class GetPatientForWebResponse {
  @Field()
  _id: string;

  @Field(() => User)
  user: User;
}
