import { Component, OnDestroy, OnInit, inject } from "@angular/core";

import { UserService } from "src/app/services/user.service";
import { catchError, of, switchMap } from "rxjs";
import { LOGIN_PAGE_URL } from "src/app/constants/web-constants";
import { Router } from "@angular/router";

@Component({
    selector: "app-logout",
    imports: [],
    template: ""
})
export class LogoutComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  private router = inject(Router);

  private $logoutUser = this.userService.logoutUser().pipe(
    switchMap((response) => {
      this.router.navigate([LOGIN_PAGE_URL]);
      return of(true);
    }),
    catchError((error) => {
      this.router.navigate([LOGIN_PAGE_URL]);
      return of(true);
    })
  );

  private logoutSubscription;
  constructor() {
    this.logoutSubscription = this.$logoutUser.subscribe();
  }

  ngOnInit() {
    this.$logoutUser.pipe().subscribe();
  }

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe();
  }
}
