import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinanceAppComponent} from "./finance/finance-app/finance-app.component";
import {ProjectsComponent} from "./components/projects/projects.component";

const routes: Routes = [
  {path: 'finance', component: FinanceAppComponent},
  {path: 'projects', component: ProjectsComponent},
];

@NgModule({
  declarations: [FinanceAppComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
