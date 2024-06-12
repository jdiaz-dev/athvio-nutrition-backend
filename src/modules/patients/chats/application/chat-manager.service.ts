import { Injectable } from '@nestjs/common';
import { GetChatDto } from 'src/modules/patients/chats/adapters/in/dtos/get-chat-dto';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';
import { Chat } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatsPersistenceService } from 'src/modules/patients/chats/adapters/out/chats-persistence.service';
import { ChatRequester } from 'src/modules/patients/chats/adapters/out/chema.types';

@Injectable()
export class ChatManagerService {
  constructor(private cps: ChatsPersistenceService) {}

  private generateParamRequester(professional: string, patient: string): ChatRequester {
    return professional ? { professional, patient } : { patient };
  }
  async addChatComment({ professional, patient, comment }: SaveChatCommentDto, selectors: Record<string, number>): Promise<Chat> {
    const chat = await this.cps.saveChatComment(
      {
        chatRequester: this.generateParamRequester(professional, patient),
        newComment: comment,
      },
      selectors,
    );
    return chat;
  }

  async getChat({ professional, patient }: GetChatDto): Promise<Chat> {
    const chat = await this.cps.getChat(this.generateParamRequester(professional, patient));
    return chat;
  }
}
