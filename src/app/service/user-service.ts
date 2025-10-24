import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {SuccessResponse} from "../model/success-response";
import {Token} from "../model/token";
import {UserInfo} from "../dto/user-info";
import {OAuthService} from "angular-oauth2-oidc";
import {LocalStorageService} from "./local-storage-service";
import {LibraryService} from "./library-service";
import {ManualService} from "./manual-service";


@Injectable({providedIn: 'root'})
export class UserService {
  baseUrl: string = 'http://localhost:8080';
  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('none', 'none'));
  isLoggedIn = false;

  constructor(private http: HttpClient,
              private libraryService: LibraryService,
              private manualService: ManualService,
              private storageService: LocalStorageService,
              private oauthService: OAuthService) {
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.getUser();
      }
    });
  }

  login1() {
    this.storageService.setLoginVariant('manual');
    this.manualService.login();
  }

  login2() {
    this.storageService.setLoginVariant('library');
    this.libraryService.login();
  }

  logout() {
    if (this.storageService.getLoginVariant() === 'manual') {
      this.logout1();
    } else {
      this.logout2();
    }
  }

  logout1() {
    this.clearData();
    this.manualService.logout();
  }

  logout2() {
    this.libraryService.logout();
  }

  saveToken(token: string) {
    this.storageService.saveToken(token);
  }

  checkCredentials(): boolean {
    if (this.storageService.getLoginVariant() === 'library') {
      return this.libraryService.hasValidAccessToken();
    }
    return localStorage.getItem('token') != null;
  }

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  fetchUsername() {
    return localStorage.getItem('username');
  }

  clearData() {
    localStorage.clear();
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

  getAuthCode() {
    this.isLoggedIn = this.checkCredentials();
    let url = new URLSearchParams(window.location.search);
    let code = url.get('code');
    if (!this.isLoggedIn && code != null && this.storageService.getLoginVariant() === 'manual') {
      this.retrieveToken(code);
    }
  }

  retrieveToken(code: string) {
    const tokenHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('app-client:app-secret'),
      'Content-type': 'application/x-www-form-urlencoded'
    });
    let params = new URLSearchParams();
    params.append('redirect_uri', 'http://localhost:4200');
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    this.http.post<Token>(this.baseUrl + '/oauth2/token', params, {headers: tokenHeaders})
      .subscribe(data => {
          this.saveToken(data.access_token);
          this.getUser();
        }
      );
  }
}
