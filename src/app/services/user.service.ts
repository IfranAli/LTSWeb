import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserDatabaseModel } from "../models/user.interface";
import { getHttpHeaders } from "../constants/web-constants";

const baseUrl = environment.backendURL + "user";
export interface LoginResponse {
  data: {
    id: number;
    username: string;
    password: string;
  };
  error: string;
}

export interface LoginResult {
  success: boolean;
  data?: {
    user: {
      id: number;
      name: string;
      accountId: number;
      token: string;
    };
    token: string;
  };
}

export interface UserStatusResponse {
  id: number;
  token: string;
  name: string;
  accountId: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserStatus() {
    const request = this.http.get<UserStatusResponse>(
      baseUrl,
      getHttpHeaders()
    );
  }

  getUsers() {
    return this.http.get<UserStatusResponse>(baseUrl, getHttpHeaders());
  }

  loginUser(username: string, password: string) {
    const loginUrl = baseUrl + "/login";
    const data = {
      username: username,
      password: password,
    };

    return this.http.post<LoginResult>(loginUrl, data, getHttpHeaders());
  }

  logoutUser() {
    const logoutUrl = baseUrl + "/logout";
    return this.http.post<UserDatabaseModel>(logoutUrl, null, getHttpHeaders());
  }
}
