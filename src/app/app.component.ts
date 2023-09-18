import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./services/user.service";
import {
  LOGIN_PAGE_URL,
} from "./constants/web-constants";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "../styles/styles.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [Location],
})
export class AppComponent {
  title = "LTSweb";
  $user = this.userService.$userData;

  constructor(private userService: UserService, private router: Router) {
    if (!this.$user()) {
      this.router.navigateByUrl(LOGIN_PAGE_URL);
    }
  }
}
