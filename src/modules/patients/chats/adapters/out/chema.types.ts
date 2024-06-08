import { Chat, ChatComment } from 'src/modules/patients/chats/adapters/out/chat.schema';

type ChatSearcher = Pick<Chat, 'patient'> & Partial<Pick<Chat, 'professional'>>;
type Comment = Pick<ChatComment, 'commenter' | 'content'>;
export type AddNewComment = { chatSearcher: ChatSearcher; newComment: Comment };
