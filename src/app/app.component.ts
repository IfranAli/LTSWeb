import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { UserService } from "./services/user.service";

import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss", "../styles/styles.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [Location],
    imports: [RouterOutlet]
})
export class AppComponent {
  $user = inject(UserService).$userData;
  path = window.location.pathname;
  title = "LTSweb";
}
