import { Component, OnInit } from '@angular/core';
import { Entry, EntryService } from 'src/app/services/entry.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { AddEntrySheet } from '../add-entry/add-entry.component';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { WeeklyAverageService } from 'src/app/services/weekly-average.service';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css']
})
export class EntryDetailComponent implements OnInit {

  public entry: Entry;
  public id: number;

  constructor(
    public route: ActivatedRoute,
    private entryService: EntryService,
    private weeklyAverageService: WeeklyAverageService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private location: Location,
    private router: Router
  ) { } 

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.entryService.getEntryDetail(this.id);
    this.entryService.entryDetailSubject.subscribe(entry => {
      this.entry = entry;
    })
  }

  editEntry(entry: Entry): void{
    const time: string = moment(entry.date).format('HH:mm');
    entry.time = time;
    this.bottomSheet.open(AddEntrySheet, {
      data: {title: 'Edit entry...', btn_cancel: 'Cancel', btn_confirm: 'Save', entry: entry}
    });
  }

  navigateToEntriesPage(){
    this.router.navigate(['/entries']);
  }

  deleteEntry(id: number): void{
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '350px',
      autoFocus: false,
      data: {title: 'Confirm deletion', message: 'Do you really want to delete this entry?', btn_cancel: 'Cancel', btn_confirm: 'Delete'}
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed){
        this.entryService.deleteEntry(id).subscribe(
          success => {
            this.entryService.removeEntryFromEntriesTable(id);
            this.weeklyAverageService.addWeeklyAveragesToSubject();
            this.location.back();
          },
          error => {
              this.snackBar.open('Error occured while deleting entry.', 'Dismiss', {duration: 6000, panelClass: ['mat-toolbar', 'mat-basic']})
              console.log(error)
          }
        )
      }
    });
  }

}
