import { UserService } from "./user.service";
import {
  clearAuthorisationToken,
} from "../constants/web-constants";
import { of, switchMap, tap } from "rxjs";
import { Injectable, computed } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private router: Router) {}

  $authenticated = computed(() => {
    return this.userService.userIsLoggedIn();
  });

  isLoggedIn(): boolean {
    return this.$authenticated();
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
          console.error("User not found");
        }
      })
    );
  }
}
