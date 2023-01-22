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
import {CalendarComponent} from "./calendar/components/calendar/calendar.component";

const routes: Routes = [
  {path: '', component: LoginDialogComponent},
  {path: 'finance', component: FinanceAppComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'calendar', component: CalendarComponent},
];

@NgModule({
  declarations: [FinanceAppComponent],
  imports: [RouterModule.forRoot(routes), NgIf, NgForOf, MatTableModule, DatePipe, MatIconModule, MatButtonModule, MatInputModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
