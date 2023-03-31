export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  timezone?: string;
  professional?: string | null;
  client?: string | null;
  isProfessional?: boolean;
  acceptedTerms?: boolean;
  isActive?: boolean;
}

export interface UpdateUser {
  user: string;
  password: string;
  acceptedTerms?: boolean;
}

export interface UpdatePassword {
  user: string;
  password: string;
}
