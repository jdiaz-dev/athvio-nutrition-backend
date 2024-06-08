import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsResolver } from 'src/modules/patients/chats/adapters/in/chats.resolver';
import { Chat, ChatSchema } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatsPersistenceService } from 'src/modules/patients/chats/adapters/out/chats-persistence.service';
import { ChatManagerService } from 'src/modules/patients/chats/application/chat-manager.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatManagerService, ChatsPersistenceService, ChatsResolver],
})
export class ChatsModule {}
