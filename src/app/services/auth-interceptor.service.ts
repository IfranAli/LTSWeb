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
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized, clear token and redirect to login page
          this.userService.removeUserDataFromLocalStorage();
          this.router.navigate([LOGIN_PAGE_URL]);
        }

        console.log("Unhandled eror: ", error.message);

        return throwError(() => new Error(error.message));
      })
    );
  }
}
