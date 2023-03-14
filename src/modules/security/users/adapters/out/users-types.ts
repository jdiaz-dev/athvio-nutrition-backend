export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  timezone?: string;
  professionalId?: string | null;
  clientId?: string | null;
  isProfessional?: boolean;
  acceptedTerms?: boolean;
  isActive?: boolean;
}

export interface UpdateUser {
  userId: string;
  password: string;
  acceptedTerms?: boolean;
}

export interface UpdatePassword {
  userId: string;
  password: string;
}
