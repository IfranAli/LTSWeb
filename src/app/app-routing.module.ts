import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard.service";

const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./components/login-dialog/login-dialog.component").then(
        (m) => m.LoginDialogComponent
      ),
  },
  {
    path: "logout",
    loadComponent: () =>
      import("./components/Logout/logout.component").then(
        (m) => m.LogoutComponent
      ),
  },
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
  {
    path: "dev-test",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/dev-test/dev-test.module").then(
        (value) => value.DevTestModule
      ),
  },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
