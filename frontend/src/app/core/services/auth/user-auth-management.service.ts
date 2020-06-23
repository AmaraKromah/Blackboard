import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUserCreation } from '../../model/auth/userCreation.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthManagementService {
  private _authRefreshNeeded$ = new Subject<boolean>();
  private baseUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient, private router: Router) {}

  get authRefreshNeeded$() {
    return this._authRefreshNeeded$.asObservable();
  }

  //check if email exsist
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/signup/email-check?email=${email}`
    );
  }
  registerUser(registration: IUserCreation) {
    console.log(registration);
    this.http
      .post<{ message: string; user: IUserCreation }>(
        `${this.baseUrl}/signup`,
        registration
      )
      .subscribe((data) => {
        console.log(data);

        // this.router.navigate(['/dashboard/educations']);
      });
  }

  confirmRegistration(token: string) {
    let statusCode: number;
    return this.http.get<{ message: string }>(
      `${this.baseUrl}/confirmation/${token}`,
      {
        observe: 'response',
      }
    );
  }
  //gebruik cookies
  login(login: object) {
    console.log;
    this.http
      .post<{ token: string }>(`${this.baseUrl}/signin`, login)
      .subscribe((response) => {
        //Gebruik hier toast als het gelukt is
        localStorage.setItem('token', response.token);
        this._authRefreshNeeded$.next(true);
        this.router.navigate(['/dashboard']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    this._authRefreshNeeded$.next(false);
    this.router.navigate(['/dashboard']);
  }
}
