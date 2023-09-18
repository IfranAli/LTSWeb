import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  WritableSignal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  filter,
  of,
  switchMap,
} from "rxjs";
import { AppState } from "./reducers";
import * as fromUsers from "./reducers/user.reducer";
import { UserService, UserStatusResponse } from "./services/user.service";
import {
  clearAuthorisationToken,
  getAuthorisationToken,
  LOGIN_PAGE_URL,
} from "./constants/web-constants";
import { AuthService } from "./services/auth.service";
import { toSignal } from "@angular/core/rxjs-interop";

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
  sidebarOpen = false;
  $user = this.userService.$userData;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    const token = getAuthorisationToken();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
