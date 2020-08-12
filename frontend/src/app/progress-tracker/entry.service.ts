import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private _http: HttpClient) { }

  postEntry(weight: number, date: string): Observable<any>{
    return this._http.post(environment.apiBaseUrl + '/log', {"weight": weight})
  }

  getEntries(): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/log')
  }

  deleteEntry(id: string): Observable<any>{
    return this._http.delete(environment.apiBaseUrl + '/log/' + id)
  }

}