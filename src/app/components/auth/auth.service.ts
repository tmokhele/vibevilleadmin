
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AngularFireAuth } from "angularfire2/auth";
import { BehaviorSubject } from "rxjs";
import * as moment from 'moment/moment';
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { TokenData } from '../../shared/model/token-data.model';
import { User } from '../../shared/model/user.model';
import { AuthData } from '../../shared/model/auth-data.model';


const UNKNOWN_USER: User = {
  username: undefined
}
const jwtHelper = new JwtHelper();
const TOKEN_KEY = 'token'
@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  user: User = { username: "" };
  private subject = new BehaviorSubject(UNKNOWN_USER);

  constructor(private router: Router, public http: HttpClient) {
    if (this.isLoggedIn()) {
      this.subject.next({ 'username': this.user.username })
    }
  }

  login(authData: AuthData) {

    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    let url ="auth/signin"
    this.http.post(url,authData,{headers: headers}).subscribe
    ((success: TokenData) => {

        this.user.username = authData.username;
        localStorage.setItem(TOKEN_KEY, success.accessToken)
        localStorage.setItem('currentUser',authData.username);
        this.subject.next({ 'username': authData.username })
        this.authSuccessfully();
      }
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.subject.next(UNKNOWN_USER);
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user.
   *
   * We use the object-spread operator [...].
   * Since this is an object [reference type] other parts of the application can
   * easily change this particular object.
   *
   * We don't want that - so we return a copy of the object as opposed to the actual one here.
   */
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

  isLoggedIn(): boolean {
    const expiration = this.tokenExpiration;
    return expiration ? moment().isBefore(expiration) : false;
  }

  private get tokenExpiration(): any {
    return this.getToken() ? moment.unix(this.getToken().exp) : null;
  }

  public getToken(): any {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token != 'undefined') {
      // return token ? jwtHelper.decodeToken(token) : null
      return token;
    } else {
      return null;
    }

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
      console.log("error" + e)
    }
  }

}