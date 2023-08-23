import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Observable, mergeMap, of, tap } from "rxjs";
import { UserStatusResponse } from "./services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      mergeMap((loggedIn) => {
        if (!loggedIn.success) {
          this.router.navigate(["/login"]);
          return of(false);
        } else {
          const user = loggedIn;
          return of(user.success);
        }
      })
    );
  }
}
