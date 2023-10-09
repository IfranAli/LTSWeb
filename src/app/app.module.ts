import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { TaskComponent } from "./components/task/task.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TaskEditViewComponent } from "./components/task-edit-view/task-edit-view.component";
import { ProjectListComponent } from "./components/project-list/project-list.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { StoreModule } from "@ngrx/store";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { reducers } from "./reducers";
import { EditProjectDialogComponent } from "./components/edit-project-dialog/edit-project-dialog.component";
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component";
import { AppRoutingModule } from "./app-routing.module";
import { ProjectsComponent } from "./components/projects/projects.component";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./services/auth.service";
import { AuthInterceptor } from "./services/auth-interceptor.service";

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
    FormsModule,
    DragDropModule,
    StoreModule.forRoot(reducers, {}),
    ReactiveFormsModule,
    TaskComponent,
    AppRoutingModule,
  ],
  providers: [
    HttpClientModule,
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
