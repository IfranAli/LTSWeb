import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  combineLatestWith,
  filter,
  forkJoin,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { loginUser, logoutUser } from "./actions/user.actions";
import { UserModel } from "./models/user.interface";
import { AppState } from "./reducers";
import * as fromUsers from "./reducers/user.reducer";
import { UserState } from "./reducers/user.reducer";
import { DataProviderService } from "./services/data-provider.service";
import { UserService, UserStatusResponse } from "./services/user.service";
import {
  clearAuthorisationToken,
  getAuthorisationToken,
  LOGIN_PAGE_URL,
} from "./constants/web-constants";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.scss",
    "../styles/styles.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [Location],
})
export class AppComponent {
  title = "LTSweb";
  user: UserModel | null = null;
  sidebarOpen = false;
  authToken$ = new BehaviorSubject<string | null>(null);

  getUserFromStore$ = this.store.select(fromUsers.selectUserState).pipe(
    filter((user) => !!user.user && user.user.id != 0),
    switchMap((user) => {
      return of(user.user as UserModel);
    })
  );

  fetchUserFromNetwork$ = this.authToken$.pipe(
    filter((value) => value !== null),
    switchMap((token) => {
      return this.authService.isLoggedIn();
    })
  );

  user$ = combineLatest([
    this.getUserFromStore$,
    this.fetchUserFromNetwork$,
  ]).pipe(
    catchError((error) => {
      clearAuthorisationToken();
      this.router.navigate([LOGIN_PAGE_URL]);
      return of(null);
    })
  );

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
    private dataProvider: DataProviderService,
    private authService: AuthService
  ) {}

  async userLogout() {
    this.userService.logoutUser();
    this.user = null;
    clearAuthorisationToken();
    return this.router.navigate([LOGIN_PAGE_URL]);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
