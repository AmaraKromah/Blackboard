import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError, Subject, empty } from 'rxjs';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: UserAuthManagementService) {}
  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //replace with cookies
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      //subcribe to the reset event time..
      catchError((error) => {
        console.log(request.url);

        if (error.status == 401) {
          if (
            request.url.includes('access-token') ||
            request.url.includes('signin') ||
            request.url.includes('confirmation') ||
            request.url.includes('forgot')
          ) {
            if (this.authService.getUserId()) {
              //todo herbekijken (custom error )
              console.log("You're already logged in, fix this");
              this.authService.logout();
            }
            const errors =
              (error && error.error && error.error.message) || error.statusText;
            console.log('@@: ', error, '\n', errors);
            return throwError(errors);
          }
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              this.authService.logout();

              return empty();
            })
          );
        }
        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable((observer) => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log('Access token refreshed');
          this.refreshingAccessToken = false;
        })
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>) {
    // get access token
    const token = this.authService.getAccessToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
