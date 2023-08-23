import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  WritableSignal,
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
import { DataProviderService } from "./services/data-provider.service";
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
  user: UserStatusResponse | null = null;
  sidebarOpen = false;
  authToken$ = new BehaviorSubject<string | null>(null);

  getUserFromStore$: Observable<UserStatusResponse> = this.store
    .select(fromUsers.selectUserState)
    .pipe(
      switchMap((user) => {
        const userModel: UserStatusResponse = {
          id: user.user?.id ?? 0,
          accountId: user.user?.accountId ?? 0,
          name: user.user?.name ?? "",
          token: user.user?.token ?? "",
        };

        return of(userModel);
      })
    );

  fetchUserFromNetwork$: Observable<UserStatusResponse> = this.authToken$.pipe(
    filter((token) => token !== null),
    switchMap((token) => {
      return this.authService.isLoggedIn().pipe(
        switchMap((loginResult) => {
          const user: UserStatusResponse = {
            id: loginResult.data?.id ?? 0,
            accountId: loginResult.data?.accountId ?? 0,
            name: loginResult.data?.name ?? "",
            token: loginResult.data?.token ?? "",
          };

          return of(user);
        })
      );
    })
  );

  // to
  // $user = toSignal(
  //   this.fetchUserFromNetwork$.pipe(
  //     switchMap((user) => {
  //       console.log(user);
  //       const userModel: UserStatusResponse = {
  //         id: user.id ?? 0,
  //         accountId: user.accountId ?? 0,
  //         name: user.name ?? "",
  //         token: user.token ?? "",
  //       };
  //       return of(userModel);
  //     }),
  //     catchError((error) => {
  //       console.log(error);
  //       return of(null);
  //     })
  //   )
  // );

  $user = toSignal(
    this.getUserFromStore$.pipe(
      switchMap((userFromStore) => {
        if (userFromStore.id === 0) {
          return this.fetchUserFromNetwork$;
        }

        const user: UserStatusResponse = {
          id: userFromStore.id ?? 0,
          accountId: userFromStore.accountId ?? 0,
          name: userFromStore.name ?? "",
          token: userFromStore.token ?? getAuthorisationToken() ?? "",
        };
        console.log(user);
        return of(user);
      })
      // catchError((error) => {
      // clearAuthorisationToken();
      // this.router.navigate([LOGIN_PAGE_URL]);
      // return of(null);
      // }),
    )
  );

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
    private dataProvider: DataProviderService,
    private authService: AuthService
  ) {
    const token = getAuthorisationToken();
    this.authToken$.next(token);
  }

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
