import {Injectable} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";
import {BehaviorSubject} from "rxjs";
import {UserInfo} from "../dto/user-info";
import {HttpClient} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class AuthService {

  baseUrl: string = 'http://localhost:8080';
  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('none', 'none'));

  constructor(private oauthService: OAuthService,
              private http: HttpClient) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.getUser();
      }
    });
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getUser() {
    this.http.get<UserInfo>(this.baseUrl + '/user').subscribe(data => {
      if (data != null) {
        this.userSubject.next(data);
      }
    })
  };
}
