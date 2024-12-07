import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class CalendarRoutingModule {
}
