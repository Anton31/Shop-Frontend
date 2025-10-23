import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class ManualService {
  constructor() {
  }
  login() {
    window.location.href = 'http://localhost:8080/oauth2/authorize?client_id=app-client&response_type=code' +
      '&scope=openid&redirect_uri=http://localhost:4200';
  }
  logout() {
    window.location.href = 'http://localhost:8080/logout';
  }
}
