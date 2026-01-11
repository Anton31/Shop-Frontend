import {inject, Injectable} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";
import {BehaviorSubject} from "rxjs";
import {UserInfo} from "../dto/user-info";
import {Cart} from "../model/cart";
import {OrderService} from "./order-service";
import {UserService} from "./user-service";


@Injectable({providedIn: 'root'})
export class AuthService {

  userSubject = new BehaviorSubject<UserInfo>(new UserInfo('', ''));
  cartSubject = new BehaviorSubject<Cart>(new Cart());

  private orderService = inject(OrderService);
  private oauthService = inject(OAuthService);
  private userService = inject(UserService);

  constructor() {
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
    this.orderService.getCart().subscribe(data => {
      if (data != null) {
        this.cartSubject.next(data);
      }
    });
  }

  getUser() {
    this.userService.getUser().subscribe(data => {
      if (data != null) {
        this.userSubject.next(data);
      }
    })
  }
}
