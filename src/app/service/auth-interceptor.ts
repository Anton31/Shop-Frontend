import {HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {LocalStorageService} from "./local-storage-service";
import {OAuthService} from "angular-oauth2-oidc";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let token;
  let storageService = inject(LocalStorageService);
  if (storageService.getLoginVariant() === 'manual') {
    token = storageService.getToken();
  }
  if (storageService.getLoginVariant() === 'library') {
    token = inject(OAuthService).getAccessToken();
  }
  if (token) {
    req = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    });
  }
  return next(req);
}




