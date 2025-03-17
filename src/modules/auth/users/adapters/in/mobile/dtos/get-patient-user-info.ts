import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { GetUserById } from 'src/modules/auth/users/adapters/out/users-types';

@InputType()
export class GetPatientUser {
  @Field()
  @IsMongoId()
  patient: string;
}
@ObjectType()
export class GetPatientUserResponse implements Pick<GetUserById, '_id' | 'firstname' | 'lastname'> {
  @Field()
  _id: string;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
}
