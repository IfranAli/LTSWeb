import {IdentityInterface} from "./Identity.interface";

export interface UserLoginModel {
  username: string,
  password: string,
}

// todo: interface vs type
export type UserLoginResult = {
  id: number,
  username: string,
  password: string,
}

export interface UserDatabaseModel extends UserLoginModel, IdentityInterface {
}

export interface UserModel extends UserDatabaseModel {
}

export const UserModelInvalid: UserModel = {
  id: -1,
  username: '',
  password: '',
}

export function isValidUser(user: UserModel): boolean {
  return user.id >= 0
    && user.username.length > 0
    && user.password.length > 0;
}
