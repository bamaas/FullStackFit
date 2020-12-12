import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';
import { WeeklyAverageService, WeeklyAverage } from './../services/weekly-average.service';
import {MatRippleModule} from '@angular/material/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(
    private _weeklyAverageService: WeeklyAverageService
  ) {}

  public displayedColumns: string[] = ['year', 'week', 'weightAverage', 'weightDifference', 'weightMeasurementCount'];
  private _weeklyAverageSub: Subscription;
  public data: WeeklyAverage[] = [];
  // public dataSource = new TableVirtualScrollDataSource<WeeklyAverage>(this.data);
  public dataSource = new MatTableDataSource<WeeklyAverage>(this.data);
  
  ngOnInit(): void {
    this._weeklyAverageSub = this._weeklyAverageService.weeklyAverageObservable.subscribe(
      (weeklyAverages: WeeklyAverage[]) => {
        this.dataSource.data = [...weeklyAverages];
      }
    );
    this._weeklyAverageService.emit();
  }

  ngOnDestroy() {
    this._weeklyAverageSub.unsubscribe();
  }

}
