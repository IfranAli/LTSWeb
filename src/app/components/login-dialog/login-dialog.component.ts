import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { loginUser } from "../../actions/user.actions";
import { UserLoginModel, UserLoginResult } from "../../models/user.interface";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginDialogComponent implements OnInit {
  @Output() onUserLogin = new EventEmitter<UserLoginResult>();

  form = new FormGroup({
    username: new FormControl<string>(""),
    password: new FormControl<string>(""),
  });

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("token")) {
      this.router.navigate(["projects"]);
    }
  }

  loginUser() {
    const rawValues = this.form.getRawValue();

    if (rawValues.password?.length == 0 || rawValues.username?.length == 0) {
      return;
    }

    const loginModel: UserLoginModel = {
      username: rawValues.username!,
      password: rawValues.password!,
    };

    localStorage.removeItem("token");

    this.userService.loginUser(loginModel).subscribe(async (value) => {
      if (value.success == false) {
        console.error("Login failed");
        return;
      }

      const user = value?.data?.user;
      const token = value?.data?.token;

      if (!user) {
        console.error("No user received from server");
        return;
      }
      if (!token) {
        console.error("No token received from server");
        return;
      }

      localStorage.setItem("token", token);

      this.store.dispatch(
        loginUser({
          id: user.id,
          password: "",
          username: user.username,
        })
      );
      this.onUserLogin.emit(user);
      await this.router.navigate(["projects"]);
    });
  }
}
