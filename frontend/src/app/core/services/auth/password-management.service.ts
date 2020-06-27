import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { UserAuthManagementService } from './user-auth-management.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagementService {
  private baseUrl = 'http://localhost:3000/auth';
  constructor(
    private http: HttpClient,
    private authservice: UserAuthManagementService,
    private router: Router
  ) {}

  //request password
  requestPassword(email: string) {
    this.http.post(`${this.baseUrl}/forgot`, { email }).subscribe((data) => {
      console.log(data);
    });
  }
  //reset password
  resetPassword(password: string, token: string) {
    this.http
      .post(
        `${this.baseUrl}/reset/${token}`,
        { password },
        {
          observe: 'response',
        }
      )
      .pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.authservice.setSession(
              res.body.userId,
              res.headers.get('x-access-token'),
              res.headers.get('x-refresh-token')
            );
          }
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.router.navigate(['/dashboard/']);
      });
  }
}
