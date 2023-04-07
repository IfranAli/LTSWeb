import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "./models/user.interface";
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {DataProviderService} from './services/data-provider.service';
import {filter, Observable, of, Subscription, switchMap, tap} from 'rxjs';
import {AppState} from './reducers';
import {Store} from '@ngrx/store';
import {loginUser} from './actions/user.actions';
import * as fromUsers from './reducers/user.reducer';
import {UserState} from './reducers/user.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'LTSweb';
  user: UserModel | null = null;
  dataProvider: DataProviderService;
  $subscription: Subscription | undefined

  $sub1: Observable<UserState> =
    this.store.select<UserState>(fromUsers.selectUserState).pipe(
      filter(user => !!user.user && user.user.id != 0),
      switchMap((user) => {
        return of(user);
      }),
      tap((user) => {
          this.user = user.user as UserModel;
        }
      ));

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
  ) {
    this.dataProvider = inject(DataProviderService);
  }

  ngOnInit() {
    const tokenName = 'token';
    const token = localStorage.getItem(tokenName);

    if (!token) {
      this.userLogout();
      this.store.dispatch(loginUser({id: 0, password: '', username: ''}));
    } else {
      this.$subscription = this.dataProvider.getUserStatus().subscribe(value => {
        this.store.dispatch(loginUser({id: value.id, password: '', username: value.name}));
      })
    }
  }

  userLogout() {
    this.userService.logoutUser().subscribe(async value => {
      localStorage.removeItem('token');
      this.user = null;
      await this.router.navigate(['']);
    })
  }

  ngOnDestroy(): void {
    this.$subscription?.unsubscribe();
  }
}
