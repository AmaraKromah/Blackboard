import { Injectable } from '@angular/core';
import { throwError, Observable, Subject } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { IAssignment } from '../model/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private _taskRefreshNeeded$ = new Subject<string>();

  private baseUrl: string = 'http://localhost:3000/assignments/';

  constructor(private http: HttpClient, private router: Router) {}

  get taskRefreshNeeded$() {
    return this._taskRefreshNeeded$.asObservable();
  }

  // overweeg om de subscribe hier te doen
  getAssignmentList(): Observable<{ assigments: IAssignment[] }> {
    return this.http
      .get<{ message: string; assigments: IAssignment[] }>(this.baseUrl)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAssignment(id: string) {
    return this.http
      .get<{ assignment: IAssignment }>(`${this.baseUrl}${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  addAssignment(
    title: string,
    description: string,
    type: string,
    deadline: Date,
    send_at: Date,
    subjectID: string,
    files: File[]
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('type', type);
    postData.append('deadline', deadline.toISOString());
    postData.append('subject', subjectID);
    postData.append('send_at', send_at.toISOString());
    for (let i = 0; i < files.length; i++) {
      postData.append('files', files[i], files[i].name);
    }
    // postData.forEach((data) => {
    //   console.log(data);
    // });
    this.http
      .post<{ message: string; assigment: IAssignment }>(this.baseUrl, postData)
      .subscribe((data) => {
        console.log(data);
        this._taskRefreshNeeded$.next();
        this.router.navigate(['dashboard/assignments']);
      });
  }

  updateAssignment(
    task_id: string,
    title: string,
    description: string,
    type: string,
    deadline: Date,
    send_at: Date,
    files: File[] = [],
    replaceCurrent: boolean
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('type', type);
    postData.append('deadline', deadline.toISOString());
    postData.append('send_at', send_at.toISOString());
    postData.append('replaceCurrent', '' + replaceCurrent);

    for (let i = 0; i < files.length; i++) {
      postData.append('files', files[i], files[i].name);
    }
    // postData.forEach((data) => {
    //   console.log(data);
    // });

    this.http
      .patch<{ message: string; deleted: any }>(
        `${this.baseUrl}${task_id}`,
        postData
      )
      .subscribe((data) => {
        this._taskRefreshNeeded$.next();
        this.router.navigate(['/dashboard/assignments']);
      });
  }

  deleteAssignment(task_id: string, files_ids: string[], delete_task: boolean) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: task_id,
        files_ids,
        delete_task,
      },
    };
    this.http
      .delete<{ message: string; deleted: any }>(
        `${this.baseUrl}${task_id}`,
        options
      )
      .subscribe(() => {
        this._taskRefreshNeeded$.next('deleteFile');
      });
  }

  /// Helpers

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
