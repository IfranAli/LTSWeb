import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AuthService } from "./services/auth.service";
import { AuthInterceptor } from "./services/auth-interceptor.service";

@NgModule({
  declarations: [AppComponent],
  providers: [
    HttpClientModule,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
})
export class AppModule {}
