import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagementService {
  private baseUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient, private router: Router) {}

  //request password
  requestPassword(email: string) {
    this.http.post(`${this.baseUrl}/forgot`, { email }).subscribe((data) => {
      console.log(data);

      // this.router.navigate(['/dashboard/educations']);
    });
  }

  //reset password
  getResetToken(token: string) {
    return this.http.get(`${this.baseUrl}/reset/${token}`);
  }

  resetPassword(password: string, token: string) {
    this.http
      .post(`${this.baseUrl}/reset/${token}`, { password })
      .subscribe((data) => {
        console.log(data);

        this.router.navigate(['/dashboard/']);
      });
  }
}
