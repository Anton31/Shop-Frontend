import {Injectable} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";
import {BehaviorSubject, Subject} from "rxjs";
import {UserInfo} from "../dto/user-info";
import {HttpClient} from "@angular/common/http";
import {Cart} from "../model/cart";


@Injectable({providedIn: 'root'})
export class AuthService {

  baseUrl: string = 'http://localhost:8080';
  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('', ''));
  cartSubject = new Subject<Cart>();

  constructor(private oauthService: OAuthService,
              private http: HttpClient) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.getUser();
        this.getCart();
      }
    });
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getCart() {
    this.http.get<Cart>(`${this.baseUrl}/cart`).subscribe(data => {
      if (data != null)
        this.cartSubject.next(data);
    });
  }

  getUser() {
    this.http.get<UserInfo>(this.baseUrl + '/user').subscribe(data => {
      if (data != null) {
        this.userSubject.next(data);
      }
    })
  };
}
