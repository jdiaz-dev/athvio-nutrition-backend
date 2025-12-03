import { UseInterceptors } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlInterceptor } from 'src/shared/adapters/in/interceptors/gql.interceptor';

@Resolver()
export class WorkFlowStreamAuditResolver {
  @Mutation(() => String)
  @UseInterceptors(GqlInterceptor)
  landingScreen(): String {
    return 'receivedd';
  }
  @Mutation(() => String)
  @UseInterceptors(GqlInterceptor)
  signUpProfessionalScreen(): String {
    return 'receivedd';
  }
}
