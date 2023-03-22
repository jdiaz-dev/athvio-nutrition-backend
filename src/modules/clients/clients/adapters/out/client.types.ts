import { ClientState } from 'src/shared/enums/project';

export interface CreateClient {
  professionalId: string;
  isActive: boolean;
  location?: string;
  timezone?: string;
  height?: number;
  weight?: number;
  birthday?: Date;
  gender?: string;
  profilePicture?: string;
  codeCountry?: string;
  phone?: string;
}

export interface UpdateClient extends CreateClient {
  clientId: string;
  state: ClientState;
}

export interface DeleteManyClientGroup {
  professionalId: string;
  clientGroupId: string;
}
