import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { GetUserById } from 'src/modules/auth/users/adapters/out/users-types';

@InputType()
export class GetPatientUser {
  @Field()
  @IsUUID()
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
