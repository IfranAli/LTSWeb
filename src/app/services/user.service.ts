import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  clearAuthorisationToken,
  getHttpHeaders,
  setAuthorisationToken,
} from "../constants/web-constants";
import { tap } from "rxjs";

const baseUrl = environment.backendURL + "user";

export interface SuccessType {
  success: boolean;
}
export interface LoginResponse {
  data: {
    id: number;
    username: string;
    password: string;
  };
  error: string;
}

export interface LoginResult extends SuccessType {
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

export interface UserData {
  userId: number;
  name: string;
  accountId: number;
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  $userData = signal<UserData | null>(null);

  // todo: This is probably wrong. need to get value from backend.
  userAccountId$ = computed(() => this.$userData()?.accountId ?? 0);

  constructor(private http: HttpClient) {
    const userData = this.getUserDataFromLocalStorage();

    if (userData) {
      this.$userData.set(userData);
    }
  }

  userIsLoggedIn(): boolean {
    return !!this.$userData()?.token;
  }

  getUserStatus() {
    const request = this.http.get<UserStatusResponse>(
      baseUrl,
      getHttpHeaders()
    );
  }

  getUsers() {
    return this.http.get<UserStatusResponse>(baseUrl, getHttpHeaders());
  }

  private USER_DATA_KEY = "UserData";
  private setUserDataToLocalStorage(userData: UserData) {
    setAuthorisationToken(userData.token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  private getUserDataFromLocalStorage(): UserData | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }

  removeUserDataFromLocalStorage() {
    localStorage.removeItem(this.USER_DATA_KEY);
    clearAuthorisationToken();
  }

  loginUser(username: string, password: string) {
    const loginUrl = baseUrl + "/login";
    const data = {
      username: username,
      password: password,
    };

    const result = this.http
      .post<LoginResult>(loginUrl, data, getHttpHeaders())
      .pipe(
        tap((value: LoginResult) => {
          if (value.success && value.data?.token) {
            const user = value.data.user;
            const userData: UserData = {
              userId: user.id,
              name: user.name,
              accountId: user.accountId,
              token: value.data?.token ?? "",
            };

            this.setUserDataToLocalStorage(userData);

            this.$userData.set(userData);
          }
        })
      );

    return result;
  }

  logoutUser() {
    const logoutUrl = baseUrl + "/logout";
    const postData = {
      token: this.$userData()?.token,
    };

    return this.http
      .post<SuccessType>(logoutUrl, postData, getHttpHeaders())
      .pipe(
        tap((value: SuccessType) => {
          if (value.success) {
            this.removeUserDataFromLocalStorage();
            this.$userData.set(null);
          }
        })
      );
  }
}
