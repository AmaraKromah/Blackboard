import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { IEducation } from '../model/education.model';
import { Subject, throwError, Observable, pipe } from 'rxjs';
import { tap, filter, map, catchError, retry } from 'rxjs/operators';

//todo
//! error handling, interceptor for error handling 
@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private education: IEducation[] = [];

  private _eduRefreshNeeded$ = new Subject<IEducation[]>();

  private baseUrl: string = 'http://localhost:3000/educations/';

  constructor(private http: HttpClient, private router: Router) {}

  get eduRefreshNeeded$() {
    return this._eduRefreshNeeded$.asObservable();
  }
  // overweeg om de subscribe hier te doen
  getEducationList(): Observable<{ educations: IEducation[] }> {
    //todo: Error handling and component uitvoering verhuizen
    return this.http
      .get<{ message: string; educations: IEducation[] }>(`${this.baseUrl}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  getEducation(id: string) {
    return this.http.get<{ education: IEducation }>(`${this.baseUrl}${id}`);
  }

  addEducation(edu: IEducation) {
    //todo error handling
    this.http
      .post<{ message: string; educations: IEducation[] }>(this.baseUrl, edu)
      .subscribe(() => {
        this._eduRefreshNeeded$.next();
        this.router.navigate(['/dashboard/educations']);
      });
  }

  updateEducation(updateEdu: IEducation) {
    //todo error handling
    this.http
      .patch<{ message: string; deleted: any }>(
        `${this.baseUrl}${updateEdu._id}`,
        updateEdu
      )
      .subscribe((data) => {
        this._eduRefreshNeeded$.next();
        this.router.navigate(['/dashboard/educations']);
      });
  }

  deleteEducation(id: string) {
    //todo error handling
    this.http
      .delete<{ message: string; deleted: any }>(`${this.baseUrl}${id}`)
      .subscribe((data) => {
        this._eduRefreshNeeded$.next();
      });
  }

  /// Helpers

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
