import { ICard } from './Card';
export interface IUserAuthPayload {
  role: string;
  email: string;
  password: string;
}

export interface IAuthPayload {
  email: string;
  password: string;
}

export interface IUserUpdatePayload {
  email?: string;
  isActive?: boolean;
}

export interface IUser {
  id: number;
  uuid: string;
  username: string;
  email: string;
  isActive: boolean;
  cards: ICard[];
}

export interface jwttoken {
  status: number;
  token: string;
  userUuid: string;
}