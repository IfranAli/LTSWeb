import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import ButtonComponent from "../stories/button.component";
import PageComponent from "../stories/page.component";
import HeaderComponent from "../stories/header.component";
import {TaskComponent} from './components/task/task.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TaskEditViewComponent} from './components/task-edit-view/task-edit-view.component';
import {ProjectListComponent} from './components/project-list/project-list.component';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {StoreModule} from '@ngrx/store';
import {projectReducer} from "./reducers/project.reducer";
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    PageComponent,
    HeaderComponent,
    TaskComponent,
    TaskEditViewComponent,
    ProjectListComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatSidenavModule,
    DragDropModule,
    StoreModule.forRoot({projectReducer}, {}),
    MatToolbarModule
  ],
  providers: [ HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
