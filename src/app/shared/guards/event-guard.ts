import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class EventGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    if (sessionStorage.getItem('event')) {
      return true;
    }
    this.router.navigate(['/venue']);
    return false;
  }
}
