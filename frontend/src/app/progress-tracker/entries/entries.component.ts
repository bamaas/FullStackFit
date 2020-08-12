import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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

  faTrash = faTrash;
  displayedColumns: string[] = ['date', 'weight', 'delete'];
  data: DataTableItem[] = [];
  dataSource = new MatTableDataSource<DataTableItem>(this.data);
  selection = new SelectionModel<DataTableItem>(true, []);

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

  postLog(){
      this.http.post(environment.apiBaseUrl + '/log', {"weight": this.logForm.controls['weight'].value}).subscribe(
        response => {
          this.getLogs()
          this.logForm.controls['weight'].reset()
        }, 
        error => {this.snackBar.open('Error occured while adding log.', 'Dismiss', {duration: 6000})}
      )
  }

  getSelectionIds(): Array<string>{
    const selectionIds: Array<string> = []
    this.selection['_selected'].forEach(element => {
      selectionIds.push(element['id'])
    });
    return selectionIds
  }

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DataTableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
