import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {
  getAuthorisationToken,
} from "src/app/constants/web-constants";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginDialogComponent implements OnInit {
  @Output() onUserLogin = new EventEmitter<any>();

  form = new FormGroup({
    username: new FormControl<string>(""),
    password: new FormControl<string>(""),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (getAuthorisationToken()) {
      this.router.navigate(["projects"]);
    }
  }

  loginUser() {
    const rawValues = this.form.getRawValue();

    if (rawValues.password?.length == 0 || rawValues.username?.length == 0) {
      return;
    }

    const username = rawValues.username!;
    const password = rawValues.password!;

    this.authService.login(username, password).subscribe((user) => {
      if (!user) {
        console.log("User not found");
        return;
      }

      this.onUserLogin.emit(user);
      return this.router.navigate(["projects"]);
    });
  }
}
