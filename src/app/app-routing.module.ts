import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component";
import { AuthGuard } from "./auth-guard.service";
import { LogoutComponent } from "./components/Logout/logout.component";

const routes: Routes = [
  { path: "login", component: LoginDialogComponent },
  { path: "logout", component: LogoutComponent },
  { path: "", redirectTo: "/projects", pathMatch: "full" },
  {
    path: "projects",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/project/project.module").then(
        (value) => value.ProjectModuleModule
      ),
  },
  {
    path: "finance",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/finance/finance.module").then(
        (value) => value.FinanceModule
      ),
  },
  {
    path: "calendar",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/calendar/calendar.module").then(
        (value) => value.CalendarModule
      ),
  },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
