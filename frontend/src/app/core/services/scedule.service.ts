import { Injectable } from '@angular/core';
import { IScedule } from '../model/scedule.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getSceduletList(){
    return this.http.get(this.baseUrl);
  }
}
