import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Chat, ChatDocument } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { AddNewComment, ChatRequester } from 'src/modules/patients/chats/adapters/out/chema.types';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { Trazability } from 'src/shared/types';

@Injectable()
export class ChatsPersistenceService extends MongodbQueryBuilder<ChatDocument> {
  constructor(
    @InjectModel(Chat.name) protected readonly chatModel: Model<ChatDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(chatModel, logger, Chat.name, als);
  }

  async createChat(data: Pick<Chat, 'uuid' | 'professional' | 'patient'>): Promise<Chat> {
    const chat = await this.initializeQuery(this.createChat.name).create(data);
    return chat;
  }
  async getChat(chatRequester: ChatRequester): Promise<Chat> {
    const chat = await this.initializeQuery(this.getChat.name).findOne(chatRequester);
    return chat;
  }
  async saveChatComment({ chatRequester, newComment }: AddNewComment, selectors: Record<string, number>): Promise<Chat> {
    const restFields = removeAttributesWithFieldNames(selectors, ['comments']);
    const res = await this.initializeQuery(this.saveChatComment.name).findOneAndUpdate(
      {
        ...chatRequester,
      },
      {
        $push: {
          comments: { ...newComment },
        },
      },
      {
        projection: { comments: { $slice: -1 }, ...restFields },
        upsert: true,
        returnDocument: 'after',
      },
    );
    return res;
  }
}
