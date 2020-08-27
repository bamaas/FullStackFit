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

  public entries: Entry[] = [];

  constructor(
    private _http: HttpClient, 
    private _snackBar: MatSnackBar
  ){}

  private entriesSubject = new Subject();
  public entriesObservable = this.entriesSubject.asObservable();

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

  // High level
  addEntryPageToTable(pageNumber: number, pageSize: number): void{
    this.getEntries(pageNumber, pageSize).subscribe(
      (data: Entry[]) => {
        data.forEach(entry => this.entries.push(entry));
        this.emitEntries();
      },
      error => {
        this._snackBar.open('Error occured while getting entries.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    );
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

  refetchEntryTable(startRange: number = 0, endRange: number = this.entries.length): void{
    this.getEntries(startRange, endRange).subscribe(
      (data: Entry[]) => {
        this.entries = data;
        this.emitEntries();
      },
      error => {
        this._snackBar.open('Error occured while refetching table.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    )
  }

  addEntryToPage(weight: number, date: string, note: string): void{
    this.postEntry(weight, date, note).subscribe(
      response => {
        this.refetchEntryTable(0, this.entries.length + 1)
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
        this.refetchEntryTable();
      }, 
      error => {
        this._snackBar.open('Error occured while updating entry.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    ) 
  }

  // this.entries = this.entries.map(
    //   entry => {
    //     if (updatedEntry['id'] == entry['id']){
    //       return updatedEntry;
    //     } else {
    //       return entry;
    //     }
    //   }

}