import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceAppComponent} from "./finance/components/finance-app/finance-app.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet} from "@angular/common";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";

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
    imports: [RouterModule.forRoot(routes), NgIf, NgForOf, MatTableModule, DatePipe, MatButtonModule, MatInputModule, AsyncPipe, NgTemplateOutlet, NgClass, NgStyle],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
