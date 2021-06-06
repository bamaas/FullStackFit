import { Component, OnInit } from '@angular/core';
import { Entry, EntryService } from 'src/app/services/entry.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { AddEntrySheet } from '../add-entry/add-entry.component';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { WeeklyAverageService } from 'src/app/services/weekly-average.service';
import { HeaderService } from 'src/app/services/header.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css']
})
export class EntryDetailComponent implements OnInit {

  public headerTitle: string = 'Log detail';
  public entry: Entry;
  public id: number;

  constructor(
    public route: ActivatedRoute,
    private entryService: EntryService,
    private weeklyAverageService: WeeklyAverageService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private router: Router,
    private headerService: HeaderService,
    private spinnerService: SpinnerService
  ) { } 

  ngOnInit(): void {
    this.setHeaderTitle();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.entryService.getEntryDetail(this.id);
    this.entryService.entryDetailSubject.subscribe(entry => {
      this.entry = entry;
      if (this.entry) this.spinnerService.showSpinner(false);
    })
  }

  setHeaderTitle(){
    this.headerService.setHeaderTitle(this.headerTitle);
  }

  editEntry(entry: Entry): void{
    const time: string = moment(entry.date).format('HH:mm');
    entry.time = time;
    this.bottomSheet.open(AddEntrySheet, {
      data: {title: 'Edit entry...', btn_cancel: 'Cancel', btn_confirm: 'Save', entry: entry}
    });
  }

  navigateToEntriesPage(){
    this.router.navigate(['/log']);
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
            this.navigateToEntriesPage();
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
