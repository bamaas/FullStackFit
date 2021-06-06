import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from './spinner.service';

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
    private _snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ){}

  public weeklyAverages: WeeklyAverage[] = [];
  private weeklyAverageSubject = new Subject<WeeklyAverage[]>();
  public weeklyAverageObservable = this.weeklyAverageSubject.asObservable();

  private getAllWeeklyAverages(): Observable<any>{
    return this._http.get(environment.apiBaseUrl + '/stats/avg/weight/all')
  }

  private emit(): void{
    this.weeklyAverageSubject.next(this.weeklyAverages);
  }

  public addWeeklyAveragesToSubject(): void{
    this.getAllWeeklyAverages().subscribe(
      (weeklyAverages: WeeklyAverage[]) => {
        weeklyAverages.forEach(
          (weeklyAverage, index: number) => {
            if (index+1 == weeklyAverages.length){
              weeklyAverage.weightDifference = null;
            } else {
              let prevWeeklyAverage = weeklyAverages[index+1];
              if (typeof prevWeeklyAverage !== "undefined"){
                if (prevWeeklyAverage['week'] == (weeklyAverage['week']-1)){
                  weeklyAverage.weightDifference = Number((weeklyAverage['weightAverage'] - prevWeeklyAverage['weightAverage']).toFixed(1));
                } else if (weeklyAverage['week'] == 0 && (prevWeeklyAverage['week'] == 52 || prevWeeklyAverage['week'] == 53)) { 
                  weeklyAverage.weightDifference = Number((weeklyAverage['weightAverage'] - prevWeeklyAverage['weightAverage']).toFixed(1));
                } else {
                  weeklyAverage.weightDifference = null;
                };
              }
            };
          });
        this.weeklyAverages = weeklyAverages;
        this.emit();
        this.spinnerService.showSpinner(false);
      },
      error => {
        this._snackBar.open('Error occured while getting statistics.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    );
  }

}
