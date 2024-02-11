export interface CreateUser {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  timezone?: string;
  countryCode?: string;
  country?: string;
  professional?: string | null;
  patient?: string | null;
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
