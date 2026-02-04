import {HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {

  const token = inject(OAuthService).getAccessToken();
  const specificEndpoint = 'http://localhost:8080/products/'
  // Check if the request URL matches the specific endpoint
  if (token && request.url === specificEndpoint) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request);
}




