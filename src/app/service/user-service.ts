import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {UserDto} from "../dto/user-dto";
import {SuccessResponse} from "../model/successResponse";
import {Token} from "../model/token";
import {UserInfo} from "../dto/user-info";
import {OAuthService} from "angular-oauth2-oidc";


type LoginVariant = 'manual' | 'library';

@Injectable()
export class UserService {
  baseUrl: string = 'http://localhost:8080';
  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('none', 'none'));
  isLoggedIn = false;

  constructor(private http: HttpClient,
              private oauthService: OAuthService) {
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.getUser();
      }
    });
  }

  login() {
    this.setLoginVariant('manual');
    window.location.href = 'http://localhost:8080/oauth2/authorize?client_id=app-client&response_type=code' +
      '&scope=openid&redirect_uri=http://localhost:4200';
  }

  login2() {
    this.setLoginVariant('library');
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.clearData();
    window.location.href = 'http://localhost:8080/logout';
    window.location.reload();
  }

  logout2() {
    this.oauthService.logOut();
  }

  setLoginVariant(variant: LoginVariant) {
    localStorage.setItem('loginVariant', variant);
  }

  getLoginVariant(): LoginVariant {
    const variant = localStorage.getItem('loginVariant');
    if (variant === 'library') {
      return variant;
    } else {
      return 'manual';
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    if (this.getLoginVariant() === 'library') {
      return this.oauthService.getAccessToken();
    }
    return localStorage.getItem('token');
  }

  checkCredentials(): boolean {
    if (this.getLoginVariant() === 'library') {
      return this.oauthService.hasValidAccessToken();

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

  addUser(dto: UserDto): Observable<SuccessResponse> {
    return this.http.post<any>(this.baseUrl + '/user', dto);
  }

  editUser(dto: UserDto): Observable<SuccessResponse> {
    return this.http.put<any>(this.baseUrl + '/user', dto);
  }

  resendRegistrationToken(token: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.baseUrl + '/user/resendRegistrationToken?token=' + token);
  }

  getAuthCode() {
    this.isLoggedIn = this.checkCredentials();
    let url = new URLSearchParams(window.location.search);
    let code = url.get('code');
    if (!this.isLoggedIn && code != null && this.getLoginVariant() === 'manual') {
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
