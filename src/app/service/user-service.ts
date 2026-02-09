import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SuccessResponse} from "../model/success-response";
import {UserInfo} from "../dto/user-info";

@Injectable({providedIn: 'root'})
export class UserService {
  baseUrl: string = 'http://localhost:8080';

  private http = inject(HttpClient);

  getUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + '/user');
  };

  addUser(data: any): Observable<SuccessResponse> {
    return this.http.post<any>(this.baseUrl + '/user', data);
  }

  editUser(data: any): Observable<SuccessResponse> {
    return this.http.put<any>(this.baseUrl + '/user', data);
  }

  resendRegistrationToken(token: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.baseUrl + '/user/resendRegistrationToken?token=' + token);
  }
}
