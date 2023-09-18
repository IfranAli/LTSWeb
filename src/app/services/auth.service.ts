import { UserService } from "./user.service";
import {
  clearAuthorisationToken,
} from "../constants/web-constants";
import { of, switchMap, tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  isLoggedIn(): boolean {
    return this.userService.userIsLoggedIn();
  }

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

        return of(user);
      }),
      tap((user) => {
        if (!user) {
          console.log("User not found");
        }
      })
    );
  }
}
