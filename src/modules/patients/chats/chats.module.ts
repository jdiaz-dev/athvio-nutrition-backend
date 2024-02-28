import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsResolver } from 'src/modules/patients/chats/adapters/in/chats.resolver';
import { Chat, ChatSchema } from 'src/modules/patients/chats/adapters/out/chat.schema';
import { ChatsPersistenceService } from 'src/modules/patients/chats/adapters/out/chats-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatsPersistenceService, ChatsResolver],
})
export class ChatsModule {}
