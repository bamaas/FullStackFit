import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private _http: HttpClient) { 
    this.getEntries()
  }

  private mySubject = new Subject();
  myObservable = this.mySubject.asObservable();

  postEntry(weight: number, date: string): Observable<any>{
    return this._http.post(environment.apiBaseUrl + '/log', {"weight": weight})
  }

  deleteEntry(id: string): Observable<any>{
    return this._http.delete(environment.apiBaseUrl + '/log/' + id)
  }

  getEntries(){
    this._http.get(environment.apiBaseUrl + '/log').subscribe(
      response => {
        this.mySubject.next(response)
      }
    )
  }
  
}