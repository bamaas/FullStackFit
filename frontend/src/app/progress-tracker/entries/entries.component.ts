import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { EntryService } from '../entry.service'
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component'
import { MatBottomSheet } from '@angular/material';
import { AddEntrySheet } from 'src/app/progress-tracker/entries/add-entry/add-entry.component'

export interface entry {
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
  data: entry[] = [];
  dataSource = new MatTableDataSource<entry>(this.data);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private snackBar: MatSnackBar,
    private _entryService: EntryService,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this._entryService.entriesObservable.subscribe(
      (entries: entry[]) => {this.dataSource.data = entries}
      )
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  logForm = new FormGroup({
    weight: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
  });

  editEntry(weight: number, date: string, note: string): void{
    const bottomSheetRef = this._bottomSheet.open(AddEntrySheet, {
      data: {title: 'Edit entry...', btn_cancel: 'Cancel', btn_confirm: 'Save', weight: weight, date: date, note: note}
    });
  }

  deleteEntry(id: number): void{
    const dialogRef = this._dialog.open(AlertDialogComponent, {
      width: '350px',
      autoFocus: false,
      data: {title: 'Confirm deletion', message: 'Do you really want to delete this entry?', btn_cancel: 'Cancel', btn_confirm: 'Delete'}
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed){
        this._entryService.deleteEntry(id).subscribe(
          body => {
            this._entryService.getEntries();
          }, 
          error => {
            this.snackBar.open('Error occured while deleting entry.', 'Dismiss', {duration: 6000})
            console.log(error)
          }
        )
      }
    });
  }

}