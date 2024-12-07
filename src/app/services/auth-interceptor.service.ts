import { UserService } from "./user.service";
import {
  LOGIN_PAGE_URL,
  clearAuthorisationToken,
} from "../constants/web-constants";
import { Observable, catchError, of, switchMap, tap, throwError } from "rxjs";
import { Injectable, inject } from "@angular/core";
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
  private userService = inject(UserService);
  private router = inject(Router);


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

        console.error("Unhandled eror: ", error.statusText);

        return throwError(() => new Error(error.message));
      })
    );
  }
}
