import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { AddNewComment } from 'src/modules/patients/chats/adapters/out/chema.types';

@Injectable()
export class ChatsPersistenceService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>) {}

  async saveChatComment({ chatSearcher, newComment }: AddNewComment, selectors: string[]): Promise<any> {
    selectors;
    const res = await this.chatModel.findOneAndUpdate(
      {
        ...chatSearcher,
      },
      {
        $push: {
          comments: { ...newComment },
        },
      },
      {
        projection: selectors,
        upsert: true,
        returnDocument: 'after',
      },
    );
    return res;
  }

  getChat() {}
}
