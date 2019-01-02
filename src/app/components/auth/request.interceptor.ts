import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoaderService } from '../../services/loader.service';
import { GlobalErrorHandler } from 'app/shared/global-error-handler';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private loaderService: LoaderService
    , private router: Router, private errorHandler: GlobalErrorHandler) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'http://18.218.238.64:8086/api/'+req.url;
    // var url ='http://localhost:8086/api/'+req.url;
    const token = this.auth.getToken();
    const authReq = req.clone({
      url: url,
      setHeaders:
      {
        'Authorization': `Bearer `+token,
        'Content-Type': 'application/json'
      }
    });
    this.loaderService.display(true);
    return next.handle(authReq).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.loaderService.display(false);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        this.loaderService.display(false);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
      .catch((error, caught) => {
        this.loaderService.display(false);
        this.errorHandler.handleError(error)
        return Observable.throw(error);
      }) as any;

  }

}
