import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { AuthService } from 'app/components/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
