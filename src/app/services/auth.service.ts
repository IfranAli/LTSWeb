import { UserService } from "./user.service";
import {
  TOKEN_KEY_NAME,
  clearAuthorisationToken,
  setAuthorisationToken,
} from "../constants/web-constants";
import { catchError, of, switchMap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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

        setAuthorisationToken(token);

        return of(user);
      })
    );
  }

  isLoggedIn() {
    const token = localStorage.getItem(TOKEN_KEY_NAME);
    if (!token) {
      return of(false);
    }

    return this.userService.getUsers().pipe(
      switchMap((response) => {
        return of(response);
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
