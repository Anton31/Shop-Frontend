import {routes} from "./routes";
import {provideRouter} from "@angular/router";
import {ApplicationConfig} from "@angular/core";
import {provideOAuthClient} from "angular-oauth2-oidc";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./service/auth-interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideOAuthClient(),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
