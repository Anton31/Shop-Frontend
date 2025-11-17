import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {SuccessResponse} from "../model/success-response";
import {UserInfo} from "../dto/user-info";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";


@Injectable({providedIn: 'root'})
export class UserService {
  baseUrl: string = 'http://localhost:8080';
  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('none', 'none'));

  constructor(private http: HttpClient,
              private oauthService: OAuthService) {
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

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  fetchUsername() {
    return localStorage.getItem('username');
  }

  getUser() {
    this.http.get<UserInfo>(this.baseUrl + '/user').subscribe(data => {
      if (data != null) {
        this.userSubject.next(data);
        this.setUsername(data.username);
      }
    });
  }

  addUser(data: any): Observable<SuccessResponse> {
    const formData = new FormData();
    formData.append("role", data.controls.role.value);
    formData.append("username", data.controls.username.value);
    formData.append("email", data.controls.email.value);
    formData.append("password", data.controls.password.value);
    formData.append("passwordConfirmed", data.controls.passwordConfirmed.value);
    return this.http.post<any>(this.baseUrl + '/user', formData);
  }

  editUser(data: any): Observable<SuccessResponse> {
    const formData = new FormData();
    formData.append("username", data.controls.username.value);
    formData.append("password", data.controls.password.value);
    formData.append("passwordConfirmed", data.controls.passwordConfirmed.value);
    return this.http.put<any>(this.baseUrl + '/user', formData);
  }

  resendRegistrationToken(token: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.baseUrl + '/user/resendRegistrationToken?token=' + token);
  }
}
