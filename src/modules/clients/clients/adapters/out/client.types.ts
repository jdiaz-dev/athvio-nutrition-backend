import { ClientState } from 'src/shared/enums/project';

export interface CreateClient {
  professional: string;
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
  client: string;
  state: ClientState;
}

export interface DeleteManyClientGroup {
  professional: string;
  clientGroup: string;
}
