import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';
import { WeeklyAverageService, WeeklyAverage } from './../services/weekly-average.service';
import {MatRippleModule} from '@angular/material/core';
import { HeaderService } from '../services/header.service';
import { Entry, EntryService } from '../services/entry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(
    private _weeklyAverageService: WeeklyAverageService,
    private headerService: HeaderService,
    private entryService: EntryService
  ) {}

  public headerTitle: string = 'Statistics';
  public displayedColumns: string[] = ['year', 'week', 'weightAverage', 'weightDifference', 'weightMeasurementCount'];
  private _weeklyAverageSub: Subscription;
  public data: WeeklyAverage[] = [];
  public dataSource = new MatTableDataSource<WeeklyAverage>(this.data);
  
  ngOnInit(): void {
    this.setHeaderTitle();
    this.getStatistics();
  }

  getStatistics(): void {
    this._weeklyAverageSub = this._weeklyAverageService.weeklyAverageObservable.subscribe(
      (weeklyAverages: WeeklyAverage[]) => {
        this.dataSource.data = [...weeklyAverages];
      }
    );
    this._weeklyAverageService.addWeeklyAveragesToSubject();
  }

  filter(year: number, week: number){
    this.entryService.filter(year, week);
  }

  setHeaderTitle(headerTitle: string = this.headerTitle){
    this.headerService.setHeaderTitle(headerTitle);
  }

  ngOnDestroy() {
    this._weeklyAverageSub.unsubscribe();
  }

}
