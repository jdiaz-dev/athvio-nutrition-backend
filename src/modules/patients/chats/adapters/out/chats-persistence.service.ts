import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { AddNewComment, ChatRequester } from 'src/modules/patients/chats/adapters/out/chema.types';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class ChatsPersistenceService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>) {}

  async createChat({ professional, patient }: Pick<Chat, 'professional' | 'patient'>): Promise<Chat> {
    try {
      const chat = await this.chatModel.create({ professional, patient });
      return chat;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getChat(chatRequester: ChatRequester): Promise<Chat> {
    try {
      const chat = await this.chatModel.findOne(chatRequester);
      return chat;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async saveChatComment({ chatRequester, newComment }: AddNewComment, selectors: Record<string, number>): Promise<Chat> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
