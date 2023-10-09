import { UserService } from "./user.service";
import {
  LOGIN_PAGE_URL,
  clearAuthorisationToken,
} from "../constants/web-constants";
import { Observable, catchError, of, switchMap, tap, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private router: Router) {}

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
