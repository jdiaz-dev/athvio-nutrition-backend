import { Field, ObjectType } from '@nestjs/graphql';
import { EnumRoles } from 'src/shared/enums/project';

@ObjectType()
export class JwtDto {
  @Field()
  _id: string;

  @Field()
  role: EnumRoles;

  @Field()
  token: string;
}
