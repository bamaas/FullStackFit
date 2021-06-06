import { Component, OnInit, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSort } from '@angular/material/sort';
import { EntryService, Entry } from '../../services/entry.service'
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component'
import { MatBottomSheet, MatTableDataSource } from '@angular/material';
import { AddEntrySheet } from 'src/app/progress-tracker/entries/add-entry/add-entry.component'
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription, Observable, merge } from 'rxjs';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll'; 
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {MatTable} from '@angular/material';
import * as moment from 'moment';
import { WeeklyAverageService } from 'src/app/services/weekly-average.service';
import { HeaderService } from 'src/app/services/header.service';
import { StyleService } from 'src/app/services/style.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit, OnDestroy {

  public headerTitle: string = 'Log overview';
  displayedColumns: string[] = ['date', 'weight', 'note', 'actions'];
  
  private mediaSub: Subscription;
  private _entriesSub: Subscription;
  private filterSetSubcription: Subscription;
  public screenHeight: number;
  public tableBodyHeight: number; // initalized in ngAfterViewInit
  public rowHeight: number = 48;
  public itemsRenderedAtViewport: number;
  public nextPageNumber: number = 0;
  public pageSize: number = 30;
  public filterSet: boolean = false;

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  router: any;

  constructor(
    private snackBar: MatSnackBar,
    private _entryService: EntryService,
    private weeklyAverageService: WeeklyAverageService,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private mediaObserver: MediaObserver,
    private _cdr: ChangeDetectorRef,
    private headerService: HeaderService,
    private styleService: StyleService
  ) {}

  ngOnInit() {
    this.setHeaderTitle();
    this.getIsFilterSet();
    this.getScreenHeight();
    this._entriesSub = this._entryService.entriesObservable.subscribe(
      (entries: Entry[]) => {
        // this.dataSource.data = entries;    Use this when enabled sorting
        this.dataSource.data = [...entries];
      }
    );
    this._entryService.emitEntries();


    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        if (change.mqAlias == 'xs'){
          this.columnFilterNoteControl.setValue(false);
        } else if (change.mqAlias != 'xs'){
          this.columnFilterNoteControl.setValue(true);
        }
      });

      this.tableBodyHeight = this.screenHeight - 64;    // this.tableBodyHeight = this.screenHeight - this._styleService.headerHeight;
      this.itemsRenderedAtViewport = Math.round((this.tableBodyHeight - 56) / this.rowHeight);
      this.onScrollDown();
  }
  
  getScreenHeight(){
    this.styleService.screenHeightObservable.subscribe(height => {
      this.screenHeight = height;
    })
  }

  getIsFilterSet(){
    this.filterSetSubcription = this._entryService.filterSet.asObservable().subscribe(value => {
      this.filterSet = value;
    })
  }

  resetFilter(){
    if (this.filterSet) {
      this.nextPageNumber = 0;
      this._entryService.resetFilter(this.pageSize);
      this.nextPageNumber++;
    }
  }

  setHeaderTitle(){
    this.headerService.setHeaderTitle(this.headerTitle);
  }

  public data: Entry[] = [];
  dataSource = new TableVirtualScrollDataSource<Entry>(this.data);

  ngAfterViewInit() {
    let o1:Observable<boolean> = this.columnFilterDateControl.valueChanges;
    let o2:Observable<boolean> = this.columnFilterWeightControl.valueChanges;
    let o3:Observable<boolean> = this.columnFilterWeightDifferenceControl.valueChanges;
    let o4:Observable<boolean> = this.columnFilterNoteControl.valueChanges;
    let o5:Observable<boolean> = this.columnFilterActionsControl.valueChanges;
    merge(o1, o2, o3, o4, o5).subscribe( 
      v => {
        this.columnDefinitions[0].show = this.columnFilterDateControl.value;  
        this.columnDefinitions[1].show = this.columnFilterWeightControl.value;
        this.columnDefinitions[2].show = this.columnFilterWeightDifferenceControl.value;
        this.columnDefinitions[3].show = this.columnFilterNoteControl.value;
        this.columnDefinitions[4].show = this.columnFilterActionsControl.value;
      }
    );
    this._cdr.detectChanges(); 
   }

  onScrollDown(): void{
    if (!this.filterSet){
      this._entryService.addEntryPageToTable(this.nextPageNumber, this.pageSize);
      this.nextPageNumber++;
    }
  }

    editEntry(entry: Entry): void{
      const time: string = moment(entry.date).format('HH:mm');
      entry.time = time;
      this._bottomSheet.open(AddEntrySheet, {
        data: {title: 'Edit entry...', btn_cancel: 'Cancel', btn_confirm: 'Save', entry: entry}
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
          success => {
            this._entryService.removeEntryFromEntriesTable(id);
            this.weeklyAverageService.addWeeklyAveragesToSubject();
          },
          error => {
              this.snackBar.open('Error occured while deleting entry.', 'Dismiss', {duration: 6000, panelClass: ['mat-toolbar', 'mat-basic']})
              console.log(error)
          }
        )
      }
    });
  }

  onClickRowMenu(e) {
    e.stopPropagation();
  }

  public columnFilterFormGroup: FormGroup = new FormGroup({
    weight: new FormControl(true),
    weightDifference: new FormControl(true),
    date: new FormControl(true),
    note: new FormControl(true),
    actions: new FormControl(true)
  });

  columnFilterWeightControl: AbstractControl = this.columnFilterFormGroup.get('weight');
  columnFilterWeightDifferenceControl: AbstractControl = this.columnFilterFormGroup.get('weightDifference');
  columnFilterDateControl: AbstractControl = this.columnFilterFormGroup.get('date');
  columnFilterNoteControl: AbstractControl = this.columnFilterFormGroup.get('note');
  columnFilterActionsControl: AbstractControl = this.columnFilterFormGroup.get('actions');

  columnDefinitions = [
    { def: 'date', label: 'Date', show: this.columnFilterDateControl.value},
    { def: 'weight', label: 'Weight', show: this.columnFilterWeightControl.value},
    { def: 'weightDifference', label: 'Difference', show: this.columnFilterWeightDifferenceControl.value},
    { def: 'note', label: 'Note', show: this.columnFilterNoteControl.value},
    { def: 'actions', label: 'Actions', show: this.columnFilterActionsControl.value}
  ]

  // Returns an array of all the columnDefinitions objects that have the key 'show' set to true
  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd=>cd.show).map(cd=>cd.def);
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
    this._entriesSub.unsubscribe();
    this.filterSetSubcription.unsubscribe();
  }

}