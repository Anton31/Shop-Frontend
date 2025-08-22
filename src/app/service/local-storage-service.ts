import {Injectable} from "@angular/core";

type LoginVariant = 'manual' | 'library';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
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
}
