import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material'

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) { 
    this.getEntries()
  }

  private entriesSubject = new Subject();
  public entriesObservable = this.entriesSubject.asObservable();

  postEntry(weight: number, date: string): Observable<any>{
    return this._http.post(environment.apiBaseUrl + '/log', {"weight": weight})
  }

  deleteEntry(id: string): Observable<any>{
    return this._http.delete(environment.apiBaseUrl + '/log/' + id)
  }

  getEntries(): void{
    this._http.get(environment.apiBaseUrl + '/log').subscribe(
      response => {
        this.entriesSubject.next(response)
      },
      error => {
        this._snackBar.open('Error occured while getting entries.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    )
  }
  
}