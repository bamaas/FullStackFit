import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { WeeklyAverageService } from './../services/weekly-average.service';
import {Router} from "@angular/router";

export interface Entry {
  id: number,
  userId: string,
  weight: number,
  date: string,
  time?: string,
  note: string,
  circumference: Circumference,
  skinfold: Skinfold
}

interface Circumference{
  neck: number,
  waist: number,
  leg: number,
  arm: number,
  chest: number,
  calf: number
}

interface Skinfold{
  chest: number,
  thigh: number,
  biceps: number,
  triceps: number,
  calf: number,
  abdominal: number
}

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private _http: HttpClient, 
    private _snackBar: MatSnackBar,
    private _weeklyAverageService: WeeklyAverageService,
    private router: Router
  ){}

  public entriesSubject = new Subject();
  public entriesObservable = this.entriesSubject.asObservable();
  public entries: Entry[] = [];
  public lastPageReached: boolean = false;

  // Low level
  getEntry(id: number): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/entry/' + id);
  }

  postEntry(entry: Entry): Observable<any>{
    return this._http.post(environment.apiBaseUrl + '/entry', entry );
  }

  putEntry(entry: Entry): Observable<any>{
    return this._http.put(environment.apiBaseUrl + '/entry', entry );
  }

  deleteEntry(id: number): Observable<any>{
    return this._http.delete(environment.apiBaseUrl + '/entry/' + id);
  }

  getEntries(pageNumber: number = 0, pageSize: number = 0): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/entry/page?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
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

  // workaround to fix duplicate entries when updating a entry on edit screen and not added any pages yet.
  private entriesTableInitialized: boolean = false;   
  addEntryPageToTable(pageNumber: number, pageSize: number): void{
    if (!this.lastPageReached){
      if (!this.entriesTableInitialized){
        this.entries = [];
      }
      this.getEntries(pageNumber, pageSize).subscribe(
        (entries: Entry[]) => {
          entries.forEach(entry => {
            this.entries.push(entry)
          });
          if (entries.length != pageSize){
            this.lastPageReached = true;
          }
          this.emitEntries();
          this._weeklyAverageService.addWeeklyAveragesToSubject();
          this.entriesTableInitialized = true;
        },
        error => {
          this._snackBar.open('Error occured while getting entries.', 'Dismiss', {duration: 6000, panelClass: ['mat-toolbar', 'mat-basic']})
          console.log(error)
        }
      );
    }
  }

  removeEntryFromEntriesTable(id: number): void{
    this.entries = this.entries.filter(entry => entry['id'] != id);
    this.emitEntries();
  }

  addEntryToPage(entry: Entry): void{
    this.postEntry(entry).subscribe(
      entry => {
        entry.expanded = true;
        this.entries.push(entry);
        this.sortEntriesByDate()
        this.emitEntries();
        this._weeklyAverageService.addWeeklyAveragesToSubject();
        this.emitEntryDetail(entry);
        this.router.navigate([`/log/${entry.id}`])
      }, 
      error => {
        this._snackBar.open('Error occured while adding entry.', 'Dismiss', {duration: 6000, panelClass: ['mat-toolbar', 'mat-basic']})
        console.log(error)
      }
    )
  }

  editEntryOnTable(entry: Entry): void{
    this.putEntry(entry).subscribe(
      updatedEntry => {
        updatedEntry.expanded = true;
        this.entries = this.entries.filter(item => item['id'] != entry.id);
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
        this._weeklyAverageService.addWeeklyAveragesToSubject();
        this.emitEntryDetail(entry);
      },
      error => {
        this._snackBar.open('Error occured while updating entry.', 'Dismiss', { duration: 6000, panelClass: ['mat-toolbar', 'mat-basic']});
        console.log(error);
      }
    ) 
  }

  // Entry detail
  public entryDetailSubject = new Subject<Entry>();

  getEntryDetail(id: number){
    this.getEntry(id).subscribe(entry => {
      this.emitEntryDetail(entry);
    })
  }

  emitEntryDetail(entry: Entry){
    this.entryDetailSubject.next(entry);
  }

}