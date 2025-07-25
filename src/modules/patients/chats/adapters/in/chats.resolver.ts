import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { Chat } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatManagerService } from 'src/modules/patients/chats/application/chat-manager.service';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';
import { SubscribePublishedMessageDto } from 'src/modules/patients/chats/adapters/in/dtos/subscribe-comment-addded.dto';
import { CommenterType } from 'src/shared/enums/project';
import { PartialChat } from 'src/modules/patients/chats/adapters/out/chema.types';
import { GetChatDto } from 'src/modules/patients/chats/adapters/in/dtos/get-chat-dto';
import { SkipThrottle } from '@nestjs/throttler';

const pubSub = new PubSub();

enum SubscriptionNames {
  PATIENT_MESSAGED = 'patientMessaged',
  PROFESSIONAL_MESSAGED = 'professionalMessaged',
}

@Resolver(() => Chat)
// @UseGuards(AuthorizationGuard)
export class ChatsResolver {
  constructor(private cms: ChatManagerService) {}

  @Query(() => Chat, { nullable: true })
  async getChat(@Args('chat') dto: GetChatDto): Promise<Chat> {
    const chat = await this.cms.getChat(dto);
    return chat;
  }
  @Mutation(() => Chat)
  @UseGuards(AuthorizationGuard)
  async saveChatComment(
    @Args('input') dto: SaveChatCommentDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PartialChat> {
    const { uuid, professional, patient, comments } = await this.cms.addChatComment(dto, selectors);

    if (dto.comment.commenter === CommenterType.PATIENT) {
      const chat = { uuid, professional, patient, comments };
      pubSub.publish(SubscriptionNames.PATIENT_MESSAGED, { patientMessaged: chat });
      return chat;
    } else {
      const chat = { uuid, patient, comments };
      pubSub.publish(SubscriptionNames.PROFESSIONAL_MESSAGED, { professionalMessaged: chat });
      return chat;
    }
  }
  @SkipThrottle()
  @Subscription(() => Chat, {
    name: SubscriptionNames.PATIENT_MESSAGED,
    defaultValue: null,
    nullable: true,
    filter: (payload: { patientMessaged: PartialChat }, variables: { input: SubscribePublishedMessageDto }): boolean => {
      const subscribe = variables.input.professional && variables.input.patient === payload.patientMessaged.patient.toString();
      return subscribe;
    },
  })
  patientMessagedSubscription(@Args('input') _dto: SubscribePublishedMessageDto) {
    const res = pubSub.asyncIterableIterator(SubscriptionNames.PATIENT_MESSAGED);
    return res;
  }

  @SkipThrottle()
  @Subscription(() => Chat, {
    name: SubscriptionNames.PROFESSIONAL_MESSAGED,
    defaultValue: null,
    nullable: true,
    filter: (payload: { professionalMessaged: PartialChat }, variables: { input: SubscribePublishedMessageDto }): boolean => {
      const subscribe =
        variables.input.professional && variables.input.patient === payload.professionalMessaged.patient.toString();
      return subscribe;
    },
  })
  professionalMessagedSubscription(@Args('input') _dto: SubscribePublishedMessageDto) {
    const res = pubSub.asyncIterableIterator(SubscriptionNames.PROFESSIONAL_MESSAGED);

    return res;
  }
}
