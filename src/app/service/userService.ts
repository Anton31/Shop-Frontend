import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {UserDto} from "../dto/userDto";
import {SuccessResponse} from "../model/successResponse";
import {Token} from "../model/token";
import {UserInfo} from "../dto/userInfo";

@Injectable()
export class UserService {
  baseUrl: string = 'http://localhost:8080';
  private readonly headers;

  constructor(private http: HttpClient, private cookies: CookieService) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookies.get('access_token'),
    })
  }

  checkCredentials() {
    return this.cookies.check('access_token');
  }

  getRole() {
    return this.cookies.get('role');
  }

  getUser(): Observable<UserInfo> {
    if (this.checkCredentials()) {
      return this.http.get<UserInfo>(this.baseUrl + '/user', {headers: this.headers});
    } else {
      return this.http.get<UserInfo>(this.baseUrl + '/user');
    }
  }

  addUser(dto: UserDto): Observable<SuccessResponse> {
    return this.http.post<any>(this.baseUrl + '/user', dto);
  }

  editUser(dto: UserDto): Observable<SuccessResponse> {
    return this.http.put<any>(this.baseUrl + '/user', dto, {headers: this.headers});
  }

  resendRegistrationToken(token: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.baseUrl + '/user/resendRegistrationToken?token=' + token);
  }

  retrieveToken(code: string) {
    const tokenHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('app-client:app-secret'),
      'Content-type': 'application/x-www-form-urlencoded'
    });
    let params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', 'http://localhost:4200');
    params.append('code', code);
    this.http.post<Token>(this.baseUrl + '/oauth2/token', params, {headers: tokenHeaders})
      .subscribe(data => {
        this.saveToken(data);
      })
  }

  saveToken(token: Token) {
    let expireDate = new Date().getTime() + (1000 * token.expires_in);
    this.cookies.set("access_token", token.access_token, expireDate);
    window.location.href = 'http://localhost:4200/';
  }
}
