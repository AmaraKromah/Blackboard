import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  error: string;
  constructor(private authenticationService: UserAuthManagementService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status != 401) {
          const error =
            (err && err.error && err.error.error.message) || err.statusText;
          console.error('@@@', error);
          return throwError(err);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
