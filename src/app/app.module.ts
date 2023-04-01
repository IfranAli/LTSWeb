import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TaskComponent} from './components/task/task.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatLegacySliderModule as MatSliderModule} from "@angular/material/legacy-slider";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {TaskEditViewComponent} from './components/task-edit-view/task-edit-view.component';
import {ProjectListComponent} from './components/project-list/project-list.component';
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {reducers} from "./reducers";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {EditProjectDialogComponent} from './components/edit-project-dialog/edit-project-dialog.component';
import {CdkMenuModule} from "@angular/cdk/menu";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import {AppRoutingModule} from './app-routing.module';
import {ProjectsComponent} from './components/projects/projects.component';
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    TaskEditViewComponent,
    ProjectListComponent,
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
