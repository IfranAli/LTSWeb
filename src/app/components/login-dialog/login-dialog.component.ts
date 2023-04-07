import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {loginUser} from "../../actions/user.actions";
import {UserLoginModel, UserLoginResult} from "../../models/user.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: [
    './login-dialog.component.scss',
  ]
})
export class LoginDialogComponent implements OnInit {
  @Output() onUserLogin = new EventEmitter<UserLoginResult>()

  form = new FormGroup({
    'username': new FormControl<string>(''),
    'password': new FormControl<string>(''),
  });

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  loginUser() {
    const rawValues = this.form.getRawValue();

    if (rawValues.password?.length == 0 || rawValues.username?.length == 0) {
      return;
    }

    const loginModel: UserLoginModel = {
      username: rawValues.username!,
      password: rawValues.password!
    }

    this.userService.loginUser(loginModel).subscribe(async value => {
      const {user, token} = value;

      if (!token) {
        console.error('No token received from server');
        return;
      }

      localStorage.setItem('token', token);

      this.store.dispatch(loginUser(user));
      this.onUserLogin.emit(user);
      await this.router.navigate(['projects']);
    })
  }
}
