import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  {
    path: "",
    loadComponent: () => import('../../components/projects/projects.component').then(m => m.ProjectsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectModuleRoutingModule {}
