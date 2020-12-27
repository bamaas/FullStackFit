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
import { StyleService } from 'src/app/services/style.service'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {MatTable} from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntriesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'weight', 'note', 'expand'];
  
  private mediaSub: Subscription;
  private _entriesSub: Subscription;
  public screenHeight: number;
  public tableBodyHeight: number; // initalized in ngAfterViewInit

  // Toggle entries
  expandedEntry: Entry | null;
  public detailState = 'collapsed';
  public expandedEntryId: number = null;

  toggleEntryState(entryId){
    if (entryId === this.expandedEntryId){
      this.detailState = this.detailState == 'expanded' ? 'collapsed' : 'expanded';
    } else {
      this.detailState = 'expanded';
    }
    this.dataSource.data.forEach(entry => {
      if (entry.id == entryId){
        entry.expanded = this.detailState == 'expanded' ? true : false;
        this.expandedEntryId = entryId;
      } else {
        entry.expanded = false;
      }
    });
  }

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  
  public rowHeight: number = 48;
  public itemsRenderedAtViewport: number;

  constructor(
    private snackBar: MatSnackBar,
    private _entryService: EntryService,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private mediaObserver: MediaObserver,
    private _styleService: StyleService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
      this.onResize();
  }

  public data: Entry[] = [];
  dataSource = new TableVirtualScrollDataSource<Entry>(this.data);

  ngAfterViewInit() {
    let o1:Observable<boolean> = this.columnFilterWeightControl.valueChanges;
    let o2:Observable<boolean> = this.columnFilterDateControl.valueChanges;
    let o3:Observable<boolean> = this.columnFilterNoteControl.valueChanges;
    let o4:Observable<boolean> = this.columnFilterActionsControl.valueChanges;
    merge(o1, o2, o3, o4).subscribe( 
      v => {
          this.columnDefinitions[0].show = this.columnFilterWeightControl.value;
          this.columnDefinitions[1].show = this.columnFilterDateControl.value;
          this.columnDefinitions[2].show = this.columnFilterNoteControl.value;
          this.columnDefinitions[3].show = this.columnFilterActionsControl.value;
          //  console.log(this.columnDefinitions);
      }
    );
    this.tableBodyHeight = this.screenHeight - 64;    // this.tableBodyHeight = this.screenHeight - this._styleService.headerHeight;
    this.itemsRenderedAtViewport = Math.round((this.tableBodyHeight - 56) / this.rowHeight);
    this.pageSize = this.itemsRenderedAtViewport * 2;
   // this.dataSource.sort = this.sort;      //COMMENTED TO DISABLE SORTING AS THIS IS CAUSING ISSUES WITH PAGINATION. This is a new feature.
    this.onScrollDown()
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   console.log(item)
    //   console.log(property)
    //   switch (property) {
    //     case 'Date': return new Date(item.date);
    //     default: return item[property];
    //   }
    // };
    // Handles ExpressionChangedAfterItHasBeenCheckedError
    this._cdr.detectChanges(); 
   }
  
  public nextPageNumber: number = 0;
  public maxPagesToRender: number = 3;
  public renderedPageNumbers: number[] = [];
  public reachedBottom: boolean = false;
  public reachedTop: boolean = true;
  public renderedPages: Array<any> = [];
  public lastPageNumber: number;
  public pageSize: number;

  onScrollDown(): void{
    this._entryService.addEntryPageToTable(this.nextPageNumber, this.pageSize);
    this.nextPageNumber++;
  } 

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      // this.tableBodyHeight = this.screenHeight - this._styleService.headerHeight; // this doesn't work for some reason. Need to retrigger something else.
    }

  editEntry(id: number, weight: number, date: string, note: string): void{
    this._bottomSheet.open(AddEntrySheet, {
      data: {title: 'Edit entry...', btn_cancel: 'Cancel', btn_confirm: 'Save', id: id, weight: weight, date: date, note: note}
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
        this._entryService.deleteEntryFromTable(id);
      }
    });
  }

  public columnFilterFormGroup: FormGroup = new FormGroup({
    weight: new FormControl(true),
    date: new FormControl(true),
    note: new FormControl(true),
    actions: new FormControl(true)
  });

  columnFilterWeightControl: AbstractControl = this.columnFilterFormGroup.get('weight');
  columnFilterDateControl: AbstractControl = this.columnFilterFormGroup.get('date');
  columnFilterNoteControl: AbstractControl = this.columnFilterFormGroup.get('note');
  columnFilterActionsControl: AbstractControl = this.columnFilterFormGroup.get('actions');

  columnDefinitions = [
    { def: 'date', label: 'Date', show: this.columnFilterDateControl.value},
    { def: 'weight', label: 'Weight', show: this.columnFilterWeightControl.value},
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
  }

}