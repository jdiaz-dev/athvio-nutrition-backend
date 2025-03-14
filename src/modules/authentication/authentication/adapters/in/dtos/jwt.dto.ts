import { EnumRoles } from '../../../../../../shared/enums/project';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtDto {
  @Field()
  _id: string;

  @Field()
  role: EnumRoles;

  @Field()
  token: string;
}
