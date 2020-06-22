import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUserCreation } from '../../model/auth/userCreation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthManagementService {
  private baseUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient, private router: Router) {}

  //check if email exsist
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/signup/email-check?email=${email}`
    );
  }
  //register
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

  //comfirm registration
  confirmRegistration(token: string) {
    let statusCode: number;
    return this.http.get<{ message: string }>(
      `${this.baseUrl}/confirmation/${token}`,
      {
        observe: 'response',
      }
    );
  }

  login(login: object) {
    console.log;
    this.http.post(`${this.baseUrl}/signin`, login).subscribe((data) => {
      console.log(data);
      //Gebruik hier toast als het gelukt is
      this.router.navigate(['/dashboard']);
    });
  }

  //login
}
