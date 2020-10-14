import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

export interface WeeklyAverage {
  year: number,
  week: number,
  weightAverage: number,
  weightDifference: number,
  weightMeasurementCount: number
}

@Injectable({
  providedIn: 'root'
})
export class WeeklyAverageService {

  constructor(
    private _http: HttpClient, 
    private _snackBar: MatSnackBar
  ){}

  public weeklyAverages: WeeklyAverage[] = [];
  private weeklyAverageSubject = new Subject();
  public weeklyAverageObservable = this.weeklyAverageSubject.asObservable();

  getAllWeeklyAverages(): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/stats/avg/weight/all')
  }

  emitEntries(): void{
    this.weeklyAverageSubject.next(this.weeklyAverages);
  }

  // High level
  addWeeklyAveragesToSubject(): void{
    this.getAllWeeklyAverages().subscribe(
      (weeklyAverages: WeeklyAverage[]) => {
        // weeklyAverages.forEach(weeklyAverage => this.weeklyAverages.push(weeklyAverage));
        this.weeklyAverages = weeklyAverages;
        this.emitEntries();
      },
      error => {
        this._snackBar.open('Error occured while getting statistics.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    );
  }

}
