import { UserService, UserStatusResponse } from "./user.service";
import {
  TOKEN_KEY_NAME,
  clearAuthorisationToken,
  setAuthorisationToken,
} from "../constants/web-constants";
import { Observable, catchError, of, switchMap, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { loginUser } from "../actions/user.actions";
import { AppState } from "../reducers";

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    
    private store: Store<AppState>,
    ) {}

  login(username: string, password: string) {
    clearAuthorisationToken();

    return this.userService.loginUser(username, password).pipe(
      switchMap((response) => {
        const user = response?.data?.user;
        const token = response?.data?.token;

        if (!user) {
          console.error("No user received from server");
          return of(null);
        }
        if (!token) {
          console.error("No token received from server");
          return of(null);
        }
        
        this.store.dispatch(
          loginUser({
            id: user.id,
            accountId: user.accountId,
            name: user.name,
            token: token,
          })
        );

        setAuthorisationToken(token);

        return of(user);
      }),
      tap((user) => {
        if (!user) {
          console.log("User not found");
        }
      })
    );
  }

  isLoggedIn(): Observable<LoginResult> {
    const token = localStorage.getItem(TOKEN_KEY_NAME);
    const loginResult: LoginResult = {
      success: false,
    };

    if (!token) {
      return of(loginResult);
    }

    return this.userService.getUsers().pipe(
      switchMap((response) => {
        loginResult.success = true;
        loginResult.data = response;
        return of(loginResult);
      }),
      catchError(() => {
        return of(loginResult);
      })
    );
  }
}

type LoginResult = {
  success: boolean;
  data?: UserStatusResponse;
};
