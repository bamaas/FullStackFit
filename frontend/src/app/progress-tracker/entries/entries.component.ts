import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { EntryService } from '../entry.service'

export interface DataTableItem {
  id: number;
  weight: number;
  timestamp: string;
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {

  displayedColumns: string[] = ['date', 'weight', 'actions'];
  data: DataTableItem[] = [];
  dataSource = new MatTableDataSource<DataTableItem>(this.data);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    private _entryService: EntryService
  ) {}

  ngOnInit() {
    this.getLogs()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  logForm = new FormGroup({
    weight: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
  });

  deleteEntry(id: string): void{
    this._entryService.deleteEntry(id).subscribe(
      body => {
        this.getLogs();
      }, 
      error => {
        this.snackBar.open('Error occured while deleting entry.', 'Dismiss', {duration: 6000})
      }
    )
  }

  getLogs(): void{
    this._entryService.getEntries().subscribe(
      (body: DataTableItem[]) => {this.dataSource.data = body},
      error => {this.snackBar.open('Error occured while retrieving log data.', 'Dismiss', {duration: 6000}), console.log(error)}
    )
  }

}