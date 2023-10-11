import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TaskEditViewComponent } from "./components/task-edit-view/task-edit-view.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./services/auth.service";
import { AuthInterceptor } from "./services/auth-interceptor.service";

@NgModule({
  declarations: [AppComponent, TaskEditViewComponent, LoginDialogComponent],
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
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
})
export class AppModule {}
