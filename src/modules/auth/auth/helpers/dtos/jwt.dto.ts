import { Field, ObjectType } from '@nestjs/graphql';
import { EnumRoles } from 'src/modules/auth/shared/enums';

@ObjectType()
export class JwtDto {
  @Field()
  uuid: string;

  @Field(() => String)
  role: EnumRoles;

  @Field()
  token: string;
}
