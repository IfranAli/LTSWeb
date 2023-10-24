import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { of } from "rxjs";

export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).$authenticated()
    ? of(true)
    : inject(Router).navigate(["/login"]);
};
