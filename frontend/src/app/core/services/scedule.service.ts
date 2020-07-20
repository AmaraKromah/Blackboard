import { Injectable } from '@angular/core';
import { IScedule } from '../model/scedule.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SceduleService {
  private _sceduleRefreshNeeded$ = new Subject<IScedule[]>();
  private baseUrl: string = 'http://localhost:3000/scedule/';

  constructor(private http: HttpClient) {}

  get sceduleRefreshNeeded$() {
    return this._sceduleRefreshNeeded$.asObservable();
  }

  getSceduletList() {
    return this.http.get(this.baseUrl);
  }

  addScedules(scedule: IScedule) {
    this.http
      .post<{ scedule: IScedule[] }>(this.baseUrl, scedule)
      .subscribe((data) => {
        this._sceduleRefreshNeeded$.next();
      });
  }

  deleteScedudle(
    sceduleID: string,
    deleteDates?: { beginDateTime: Date; endDateTime: Date },
    deleteOption?: number
  ) {
    // console.log(sceduleID, deleteDates, 'option: ', deleteOption);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        deleteDates,
        deleteOption,
      },
    };
    this.http
      .delete<{ message: string; deleted: any }>(
        `${this.baseUrl}${sceduleID}`,
        options
      )
      .subscribe((data) => {
        console.log(data);

        this._sceduleRefreshNeeded$.next();
      });
  }
}
