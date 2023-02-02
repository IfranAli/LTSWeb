import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceAppComponent} from "./finance/components/finance-app/finance-app.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {path: '', component: LoginDialogComponent},
  {path: 'projects', component: ProjectsComponent},
  {
    path: 'finance',
    loadChildren: () => import('./finance/finance.module')
      .then(value => value.FinanceModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module')
      .then(value => value.CalendarModule)
  },
];

@NgModule({
  declarations: [FinanceAppComponent],
  imports: [RouterModule.forRoot(routes), NgIf, NgForOf, MatTableModule, DatePipe, MatIconModule, MatButtonModule, MatInputModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
