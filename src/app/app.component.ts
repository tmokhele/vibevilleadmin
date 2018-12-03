import { Component} from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';
import { AuthService } from './components/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showLoader: boolean;
  authSubscription: Subscription;
  isAuth = false;
  constructor(private router: Router, private loaderService: LoaderService, private authService: AuthService)
  {
    this.router.events.subscribe((event: Event) => {
      switch (true)
      {
        case event instanceof NavigationStart: {
         this.loaderService.display(true);
          break;

        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:{
          this.loaderService.display(false);
          break;
        }
        default:{
          break;
        }
      }
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
       this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
