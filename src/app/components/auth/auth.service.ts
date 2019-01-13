
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment/moment';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { TokenData } from '../../shared/model/token-data.model';
import { User } from '../../shared/model/user.model';
import { AuthData } from '../../shared/model/auth-data.model';
import { PasswordReset } from 'app/shared/model/passwordreset-model';
import { IUserItem } from 'app/shared/model/user-item.interface';
import { UserItem } from 'app/shared/model/user-item';


const UNKNOWN_USER: User = {
  username: undefined
}
const jwtHelper = new JwtHelper();
const TOKEN_KEY = 'token'
@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  user: User = { username: '' };
  private subject = new BehaviorSubject(UNKNOWN_USER);

  constructor(private router: Router, public http: HttpClient) {
    if (this.isLoggedIn()) {
      this.subject.next({ 'username': this.user.username })
    }
  }

  login(authData: AuthData) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    this.http.post('auth/signin', authData, { headers: headers }).subscribe
      ((success: TokenData) => {
        this.user.username = authData.username;
        localStorage.setItem(TOKEN_KEY, success.accessToken)
        localStorage.setItem('currentUser', authData.username);
        this.subject.next({ 'username': authData.username })
        this.setCurrentUser(success);
        this.authSuccessfully();
      }
      );
  }

  setCurrentUser(user: TokenData) {
    if (sessionStorage.getItem('currentUserInfo') === null) {
      sessionStorage.setItem('currentUserInfo', JSON.stringify(user.accountInfo))
    }
  }

  getCurrentUser(): Observable<IUserItem> {
    const a = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    if (a !== null) {
    return new Observable((observer) => {
        // observable execution
        observer.next(a)
        observer.complete()
    })
  } else {
    return new Observable((observer) => {
      // observable execution
      observer.next(new UserItem())
      observer.complete()
  })
  }
  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem(TOKEN_KEY);
    this.subject.next(UNKNOWN_USER);
    this.user = { username: '' };
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user !== null;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/dashboard']);
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token != null && jwtHelper.isTokenExpired(token)) {
      // sessionStorage.clear();
      // localStorage.clear();
      // this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    const expiration = this.tokenExpiration;
    return expiration ? moment().isBefore(expiration) : false;
  }

  private get tokenExpiration(): any {
    return this.getToken() ? moment.unix(this.getToken().exp) : null;
  }

  public getToken(): any {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token != null && !jwtHelper.isTokenExpired(token)) {
      return token;
    }
    if (token != null && jwtHelper.isTokenExpired(token)) {
      console.log('Expired Token: ' + jwtHelper.getTokenExpirationDate(token))
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    return null;

  }

  isUserAdmin(): boolean {
    // return this.token ? this.token.scope.includes('admin') : false
    return true;
  }

  get authenticatedUserId(): string {
    try {
      if (tokenNotExpired(TOKEN_KEY)) {
        return this.getToken().userId;
      } else {
        return;
      }
    } catch (e) {
      console.log('error' + e)
    }
  }

  confirmPasswordReset(data: any): Observable<PasswordReset> {
    return this.http.post<PasswordReset>('auth/confirm', data)
  }
  resetPassword(data: any): any {
    return this.http.post<PasswordReset>('auth/reset', data);
  }

}
