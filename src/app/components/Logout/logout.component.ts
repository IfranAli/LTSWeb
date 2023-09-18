import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "src/app/services/user.service";
import { catchError, of, switchMap } from "rxjs";
import { LOGIN_PAGE_URL } from "src/app/constants/web-constants";
import { Router } from "@angular/router";

@Component({
  selector: "app-logout",
  standalone: true,
  imports: [CommonModule],
  template: "",
})
export class LogoutComponent implements OnInit, OnDestroy {
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
  constructor(public userService: UserService, private router: Router) {
    this.logoutSubscription = this.$logoutUser.subscribe();
  }

  ngOnInit() {
    this.$logoutUser.pipe().subscribe();
  }

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe();
  }
}
