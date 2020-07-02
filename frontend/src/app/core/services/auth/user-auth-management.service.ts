import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUserCreation } from '../../model/auth/userCreation.model';
import { Observable, Subject } from 'rxjs';
import { share, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
//todo - maak een aparte service voor webrequests
export class UserAuthManagementService {
  private _authRefreshNeeded$ = new Subject<boolean>();
  private baseUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient, private router: Router) {}

  private acesstoken: string;
  get authRefreshNeeded$() {
    return this._authRefreshNeeded$.asObservable();
  }

  //check if user is verify
  // checkVerify(email: string) {}
  //check if email exsist
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/signup/email-check?email=${email}`
    );
  }
  registerUser(registration: IUserCreation) {
    this.http
      .post<{ message: string; user: IUserCreation }>(
        `${this.baseUrl}/signup`,
        registration
      )
      .subscribe();
  }

  confirmRegistration(token: string) {
    return this.http
      .get(`${this.baseUrl}/confirmation/${token}`, {
        observe: 'response',
      })
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.setSession(
              res.body.userId,
              res.headers.get('x-access-token'),
              res.headers.get('x-refresh-token')
            );
          }
        })
      );
  }
  //gebruik cookies
  login(login: object) {
    return this.http
      .post(`${this.baseUrl}/signin`, login, {
        observe: 'response',
      })
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          this.setSession(
            res.body.logginUser._id,
            res.headers.get('x-access-token'),
            res.headers.get('x-refresh-token')
          );
          console.log('LOGGED IN', res);
          this._authRefreshNeeded$.next();
        })
      );
  }

  get loggedIn() {
    return localStorage.getItem('x-access-token') ? true : false;
  }
  logout() {
    this.removeSession();
    //-logout to home page
    this._authRefreshNeeded$.next();
    this.router.navigate(['/dashboard']);
  }

  //#try using getters and setters again
  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }
  setAccesToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setSession(userId: string, accessToken: string, refreshToken: string) {
    //vervangen door cookies?
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    //vervangen door cookies?
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.baseUrl}/tokens/access-token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken(),
          _id: this.getUserId(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          console.log('TOKEN refreshed: ', res);
          this.setAccesToken(res.headers.get('x-access-token'));
        })
      );
  }
}
