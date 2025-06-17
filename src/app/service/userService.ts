import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDto} from "../dto/userDto";
import {SuccessResponse} from "../model/successResponse";
import {Token} from "../model/token";
import {UserInfo} from "../dto/userInfo";

@Injectable()
export class UserService {
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  checkCredentials() {
    return localStorage.getItem('token') != null;
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  clearData() {
    localStorage.clear();
  }

  getUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + '/user');
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
          window.location.href = '/products';
        }
      )
  }
}
