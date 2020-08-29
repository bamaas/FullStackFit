import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

export interface Entry {
  id: number,
  weight: number,
  date: string,
  note: string
}

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private _http: HttpClient, 
    private _snackBar: MatSnackBar
  ){}

  private entriesSubject = new Subject();
  public entriesObservable = this.entriesSubject.asObservable();
  public entries: Entry[] = [];
  public lastPageReached: boolean = false;

  // Low level
  postEntry(weight: number, date: string, note: string): Observable<any>{
    return this._http.post(environment.apiBaseUrl + '/log', {"weight": weight, "date": date, "note": note} )
  }

  putEntry(id:number, weight: number, date: string, note: string): Observable<any>{
    return this._http.put(environment.apiBaseUrl + '/log', {"id": id, "weight": weight, "date": date, "note": note} )
  }

  deleteEntry(id: number): Observable<any>{
    return this._http.delete(environment.apiBaseUrl + '/log/' + id)
  }

  getEntries(pageNumber: number, pageSize: number): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/log?pageNumber=' + pageNumber + '&pageSize=' + pageSize)
  }

  emitEntries(): void{
    this.entriesSubject.next(this.entries);
  }

  sortEntriesByDate(): void{
    this.entries.sort(function(a,b){
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    });
  }

  // High level
  addEntryPageToTable(pageNumber: number, pageSize: number): void{
    if (!this.lastPageReached){
      this.getEntries(pageNumber, pageSize).subscribe(
        (entries: Entry[]) => {
          entries.forEach(entry => this.entries.push(entry));
          if (entries.length != pageSize){
            this.lastPageReached = true;
          }
          this.emitEntries();
        },
        error => {
          this._snackBar.open('Error occured while getting entries.', 'Dismiss', {duration: 6000})
          console.log(error)
        }
      );
    }
  }

  deleteEntryFromTable(id: number): void{
    this.deleteEntry(id).subscribe(
      response => {
        this.entries = this.entries.filter(entry => entry['id'] != id);
        this.emitEntries();
      }, 
      error => {
        this._snackBar.open('Error occured while deleting entry.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    )
  }

  addEntryToPage(weight: number, date: string, note: string): void{
    this.postEntry(weight, date, note).subscribe(
      entry => {
        this.entries.push(entry);
        this.sortEntriesByDate()
        this.emitEntries();
      }, 
      error => {
        this._snackBar.open('Error occured while adding entry.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    )
  }

  editEntryOnTable(id:number, weight: number, date: string, note: string): void{
    this.putEntry(id, weight, date, note).subscribe(
      updatedEntry => {
        this.entries = this.entries.filter(entry => entry['id'] != id);
        if (this.entries.length != 0){    // If there are multiple entries
          let lastEntry = this.entries[this.entries.length-1]
          // @ts-ignore
          if ((new Date(updatedEntry['date']) - new Date(lastEntry['date'])) > 0){
            this.entries.push(updatedEntry);
          } else if (this.lastPageReached) {
            // If last page reached and this entry will not be pushed, it will be gone because frontend will not fetch
            // So, if last page reached -> push to entries array.
            this.entries.push(updatedEntry);
          }
        } else {    // If there is only 1 entry
          this.entries.push(updatedEntry);
        }
        this.sortEntriesByDate()
        this.emitEntries();
      },
      error => {
        this._snackBar.open('Error occured while updating entry.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    ) 
  }

}