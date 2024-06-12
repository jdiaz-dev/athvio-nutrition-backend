import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { AddNewComment, ChatRequester } from 'src/modules/patients/chats/adapters/out/chema.types';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class ChatsPersistenceService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>) {}

  async saveChatComment({ chatRequester, newComment }: AddNewComment, selectors: Record<string, number>): Promise<Chat> {
    const restFields = removeAttributesWithFieldNames(selectors, ['comments']);
    const res = await this.chatModel.findOneAndUpdate(
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

  async getChat(chatRequester: ChatRequester): Promise<Chat> {
    const chat = await this.chatModel.findOne(chatRequester);
    return chat;
  }
}
