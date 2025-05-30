import {Injectable, signal} from "@angular/core";
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth-config";
import {UserService} from "./userService";


@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  profile = signal<any>(null);

  constructor(private oAuthService: OAuthService,
              private userService: UserService) {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.userService.saveToken(this.oAuthService.getIdToken());
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.logOut();
    this.profile = signal<any>(null);
  }
}
