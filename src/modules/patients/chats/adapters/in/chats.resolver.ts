import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';
import { ChatsPersistenceService } from 'src/modules/patients/chats/adapters/out/chats-persistence.service';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';
import { Chat } from 'src/modules/patients/chats/adapters/out/chat.schema';

const pubSub = new PubSub();

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private cps: ChatsPersistenceService) {}

  @Mutation(() => Chat)
  @UseGuards(AuthorizationGuard)
  async saveChatComment(
    @Args('input') dto: SaveChatCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Chat> {
    const chat = await this.cps.saveChatComment(dto, selectors);
    const res = await pubSub.publish('newComment', { chat });
    console.log('---------res1', res);
    return chat;
  }

  @Subscription(() => Chat)
  commentAdded() {
    const res = pubSub.asyncIterator('newComment');
    console.log('---------res2', res);
    return res;
  }
}
