import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  effect,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./services/user.service";
import { LANDING_PAGE_URL, LOGIN_PAGE_URL } from "./constants/web-constants";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "../styles/styles.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [Location],
})
export class AppComponent {
  router = inject(Router);
  userService = inject(UserService);
  $user = this.userService.$userData;
  path = window.location.pathname;
  title = "LTSweb";

  constructor() {
    if (!this.$user() && this.path !== LOGIN_PAGE_URL) {
      this.router.navigateByUrl(LOGIN_PAGE_URL);
    }
  }
}
