import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';

export interface DataTableItem {
  id: number;
  weight: number;
  timestamp: string;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  displayedColumns: string[] = ['date', 'weight'];
  data: DataTableItem[] = [];
  dataSource = new MatTableDataSource<DataTableItem>(this.data);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getLogs()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  logForm = new FormGroup({
    weight: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
  });

  postLog(){
      this.http.post(environment.apiBaseUrl + '/log', {"weight": this.logForm.controls['weight'].value}).subscribe(
        response => {
          this.getLogs()
          this.logForm.controls['weight'].reset()
        }, 
        error => {this.snackBar.open('Error occured while adding log.', 'Dismiss', {duration: 6000})}
      )
  }

  getLogs(){
    this.http.get<DataTableItem[]>(environment.apiBaseUrl + '/log').subscribe(
      (body: DataTableItem[]) => {this.dataSource.data = body},
      error => {this.snackBar.open('Error occured while retrieving log data.', 'Dismiss', {duration: 6000})}
    )
  }

}