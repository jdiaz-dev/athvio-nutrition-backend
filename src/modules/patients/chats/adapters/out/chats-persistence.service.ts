import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';

@Injectable()
export class ChatsPersistenceService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>) {}

  async saveChatComment(dto: SaveChatCommentDto, selectors: string[]): Promise<any> {
    selectors
    const res = await this.chatModel.findOneAndUpdate(
      {
        professional: dto.professional,
        patient: dto.patient,
      },
      {
        $push: {
          comments: { ...dto.comment },
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
