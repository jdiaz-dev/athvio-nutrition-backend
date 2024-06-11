import { Injectable } from '@nestjs/common';
import { SaveChatCommentDto } from 'src/modules/patients/chats/adapters/in/dtos/save-chat-comment.dto';
import { Chat } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatsPersistenceService } from 'src/modules/patients/chats/adapters/out/chats-persistence.service';

@Injectable()
export class ChatManagerService {
  constructor(private cps: ChatsPersistenceService) {}

  async addChatComment({ professional, patient, comment }: SaveChatCommentDto, selectors: Record<string, number>): Promise<Chat> {
    const requestingProfessional = { professional: professional, patient: patient };
    const requestingPatient = { patient: patient };

    const chat = await this.cps.saveChatComment(
      {
        chatSearcher: professional ? requestingProfessional : requestingPatient,
        newComment: comment,
      },
      selectors,
    );
    return chat;
  }

  getChat() {}
}
