
import {
  Component,
  ViewEncapsulation,
  inject,
  output
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { getAuthorisationToken } from "src/app/constants/web-constants";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "app-login-dialog",
    templateUrl: "./login-dialog.component.html",
    styleUrls: ["./login-dialog.component.css"],
    encapsulation: ViewEncapsulation.None,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogComponent
]
})
export class LoginDialogComponent extends DialogBaseComponent {
  readonly onUserLogin = output<any>();

  router = inject(Router);
  authService = inject(AuthService);

  form = new FormGroup({
    username: new FormControl<string>(""),
    password: new FormControl<string>(""),
  });

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
