import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SuccessResponse} from "../model/success-response";

@Injectable({providedIn: 'root'})
export class UserService {
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
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
