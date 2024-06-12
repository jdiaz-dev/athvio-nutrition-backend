import { Chat, ChatComment } from 'src/modules/patients/chats/adapters/out/chat.schema';

export type ChatRequester = Pick<Chat, 'patient'> & Partial<Pick<Chat, 'professional'>>;
type Comment = Pick<ChatComment, 'commenter' | 'content'>;
export type AddNewComment = { chatRequester: ChatRequester; newComment: Comment };

export type PartialChat = Partial<Pick<Chat, 'professional'> & Omit<Chat, 'professional'>>;
