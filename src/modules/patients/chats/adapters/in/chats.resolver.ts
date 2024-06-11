import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { Chat } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatManagerService } from 'src/modules/patients/chats/application/chat-manager.service';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';
import { SubscribeCommentAddedDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto copy';
import { CommenterType } from 'src/shared/enums/project';
import { PartialChat } from 'src/modules/patients/chats/adapters/out/chema.types';

const pubSub = new PubSub();
@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private cms: ChatManagerService) {}

  @Mutation(() => Chat)
  @UseGuards(AuthorizationGuard)
  async saveChatComment(
    @Args('input') dto: SaveChatCommentDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
    //TODO: use context with pubSub for subscriptions
    // @Context('pubsub') pubSub: PubSub,
  ): Promise<PartialChat> {
    const { _id, professional, patient, comments } = await this.cms.addChatComment(dto, selectors);

    if (!dto.professional && dto.comment.commenter === CommenterType.PATIENT) {
      const chat = { _id, professional, patient, comments };
      pubSub.publish('commentAddedByPatient', { commentAddedByPatient: chat });
      return chat;
    } else {
      const chat = { _id, patient, comments };
      pubSub.publish('commentAddedByProfessional', { commentAddedByProfessional: chat });
      return chat;
    }
  }

  @Subscription(() => Chat, {
    name: 'commentAddedByPatient',
    defaultValue: null,
    nullable: true,
    filter: (payload: { commentAddedByPatient: PartialChat }, variables: { input: SubscribeCommentAddedDto }): boolean => {
      const subscribe =
        variables.input.professional &&
        variables.input.patients.some((patient) => patient === payload.commentAddedByPatient.patient.toString());
      return subscribe;
    },
  })
  commentAddedSubscription(@Args('input') _dto: SubscribeCommentAddedDto) {
    const res = pubSub.asyncIterator('commentAddedByPatient');
    return res;
  }
}
