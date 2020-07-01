import { Injectable } from '@angular/core';
import { ISubject } from '../model/subject.model';
import { Subject, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private _subjRefreshNeeded$ = new Subject<ISubject[]>();
  private baseUrl: string = 'http://localhost:3000/subjects/';
  private _subjID: string;

  constructor(private http: HttpClient, private router: Router) {}

  get subjRefreshNeeded$() {
    return this._subjRefreshNeeded$.asObservable();
  }
  get subjID(): string {
    return this._subjID;
  }
  set subjID(id: string) {
    this._subjID = id;
  }

  // overweeg om de subscribe hier te doen
  getSubjectList(): Observable<{ subjects: ISubject[] }> {
    return this.http
      .get<{ message: string; subjects: ISubject[] }>(this.baseUrl)
      .pipe(retry(3), catchError(this.handleError));
  }

  getSubject(id: string) {
    return this.http
      .get<{ subject: ISubject }>(`${this.baseUrl}${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  addSubject(subj: ISubject) {
    this.http
      .post<{ message: string; educations: ISubject[] }>(this.baseUrl, subj)
      .subscribe(() => {
        this._subjRefreshNeeded$.next();
        this.router.navigate(['/dashboard/content/subjects']);
      });
  }

  updateSubject(updateEdu: ISubject) {
    this.http
      .patch<{ message: string; deleted: any }>(
        `${this.baseUrl}${updateEdu._id}`,
        updateEdu
      )
      .subscribe((data) => {
        this._subjRefreshNeeded$.next();
        this.router.navigate(['dashboard/content/subjects']);
      });
  }

  deleteSubject(id: string) {
    this.http
      .delete<{ message: string; deleted: any }>(`${this.baseUrl}${id}`)
      .subscribe(() => {
        this._subjRefreshNeeded$.next();
      });
  }

  /// Helpers

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
