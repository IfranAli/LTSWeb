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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TaskEditViewComponent} from './components/task-edit-view/task-edit-view.component';
import {ProjectListComponent} from './components/project-list/project-list.component';
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {reducers} from "./reducers";
import {EditTaskDialogComponent} from './components/edit-task-dialog/edit-task-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {EditProjectDialogComponent} from './components/edit-project-dialog/edit-project-dialog.component';
import {CdkMenuModule} from "@angular/cdk/menu";
import {MatSelectModule} from "@angular/material/select";
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import { AppRoutingModule } from './app-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    PageComponent,
    HeaderComponent,
    TaskEditViewComponent,
    ProjectListComponent,
    ButtonComponent,
    EditTaskDialogComponent,
    EditProjectDialogComponent,
    LoginDialogComponent,
    ProjectsComponent,
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
    MatListModule,
    MatGridListModule,
    MatSidenavModule,
    DragDropModule,
    StoreModule.forRoot(reducers, {}),
    MatToolbarModule,
    ReactiveFormsModule,
    MatDialogModule,
    CdkMenuModule,
    MatSelectModule,
    TaskComponent,
    AppRoutingModule,
    MatNativeDateModule,
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
