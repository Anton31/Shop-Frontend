import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class ManualService {

  login() {
    window.location.href = 'http://localhost:8080/oauth2/authorize?client_id=app-client&response_type=code' +
      '&scope=openid&redirect_uri=http://localhost:4200';
  }

  logout() {
    if (window.location.href == '/') {
      window.location.href = 'http://localhost:8080/logout';
      window.location.reload();
    } else {
      window.location.href = 'http://localhost:8080/logout';
      window.location.replace('/');
    }
  }
}
