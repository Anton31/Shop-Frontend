import {HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  let token = inject(OAuthService).getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    });
  }
  return next(req);
}




