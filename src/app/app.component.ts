import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter, Observable, of, Subscription, switchMap, tap } from "rxjs";
import { loginUser } from "./actions/user.actions";
import { UserModel } from "./models/user.interface";
import { AppState } from "./reducers";
import * as fromUsers from "./reducers/user.reducer";
import { UserState } from "./reducers/user.reducer";
import { DataProviderService } from "./services/data-provider.service";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.scss",
    "../styles/styles.scss",
    // todo: remove depenency on angular material (bugs out dialogs without it).
    "../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  title = "LTSweb";
  user: UserModel | null = null;
  dataProvider: DataProviderService;
  $subscription: Subscription | undefined;
  sidebarOpen = false;

  $sub1: Observable<UserState> = this.store
    .select<UserState>(fromUsers.selectUserState)
    .pipe(
      filter((user) => !!user.user && user.user.id != 0),
      switchMap((user) => {
        return of(user);
      }),
      tap((user) => {
        this.user = user.user as UserModel;
      })
    );

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router
  ) {
    this.dataProvider = inject(DataProviderService);
  }

  ngOnInit() {
    const tokenName = "Authorization";
    const token = localStorage.getItem(tokenName);

    if (!token) {
      this.userLogout();
      this.store.dispatch(loginUser({ id: 0, password: "", username: "" }));
    } else {
      this.$subscription = this.dataProvider.getUserStatus().subscribe(
        (value) => {
          this.store.dispatch(
            loginUser({ id: value.id, password: "", username: value.name })
          );
        },
        (error) => {
          localStorage.removeItem(tokenName);
          this.router.navigate([""]);
        }
      );
    }
  }

  userLogout() {
    this.userService.logoutUser().subscribe(async (value) => {
      localStorage.removeItem("Authorization");
      this.user = null;
      await this.router.navigate([""]);
    });
  }

  ngOnDestroy(): void {
    this.$subscription?.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
