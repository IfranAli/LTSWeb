import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserDatabaseModel, UserLoginModel} from "../models/user.interface";
import {getHttpHeaders} from "../constants/web-constants";

const baseUrl = environment.backendURL + 'user'

export interface LoginResult {
  user: UserDatabaseModel,
  token: string
}

export interface UserStatusResponse {
  id: number,
  token: string,
  name: string,
  accountId: number,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {
  }

  getUsers() {
    return this.http.get<UserStatusResponse>(baseUrl, getHttpHeaders());
  }

  loginUser(userLoginModel: UserLoginModel) {
    const loginUrl = baseUrl + '/login';
    return this.http.post<LoginResult>(loginUrl, userLoginModel, getHttpHeaders());
  }

  logoutUser() {
    const logoutUrl = baseUrl + '/logout';
    return this.http.post<UserDatabaseModel>(logoutUrl, null, getHttpHeaders());
  }
}
