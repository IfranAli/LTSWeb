import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectsComponent } from "./components/projects/projects.component";
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from "@angular/common";
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component";
import { AuthGuard } from "./auth-guard.service";
import { ImportFinanceDialogComponent } from "./finance/components/import-finance-dialog/import-finance-dialog.component";
import { LogoutComponent } from "./components/Logout/logout.component";

const routes: Routes = [
  { path: "login", component: LoginDialogComponent },
  { path: "logout", component: LogoutComponent },
  { path: "", redirectTo: "/projects", pathMatch: "full" },
  { path: "projects", component: ProjectsComponent, canActivate: [AuthGuard] },
  {
    path: "finance",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./finance/finance.module").then((value) => value.FinanceModule),
  },
  {
    path: "calendar",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./calendar/calendar.module").then(
        (value) => value.CalendarModule
      ),
  },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
    NgIf,
    NgForOf,
    DatePipe,
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    ImportFinanceDialogComponent,
  ],
})
export class AppRoutingModule {}
