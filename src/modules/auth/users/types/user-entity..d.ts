import { UserEntity } from 'src/modules/auth/users/domain/user-entity';

type OnlyProperties<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type UserForProfessional = OnlyProperties<Omit<UserEntity, 'uuid' | 'email' | 'isActive' | 'role'>>;
