import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinanceAppComponent } from "./finance/components/finance-app/finance-app.component";
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
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { AuthGuard } from "./auth-guard.service";
import { ImportFinanceDialogComponent } from "./finance/components/import-finance-dialog/import-finance-dialog.component";

const routes: Routes = [
  { path: "login", component: LoginDialogComponent },
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
  providers: [AuthGuard],
  imports: [
    RouterModule.forRoot(routes),
    NgIf,
    NgForOf,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatInputModule,
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    ImportFinanceDialogComponent,
  ],
})
export class AppRoutingModule {}
