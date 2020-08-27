import { Component, OnInit, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { EntryService } from '../entry.service'
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component'
import { MatBottomSheet } from '@angular/material';
import { AddEntrySheet } from 'src/app/progress-tracker/entries/add-entry/add-entry.component'
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription, Observable, merge } from 'rxjs';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll'; 
import { StyleService } from 'src/app/style.service'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';

export interface entry {
  id: number,
  weight: number,
  date: string,
  note: string
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'weight', 'note', 'actions'];
  data: entry[] = [];
  
  private mediaSub: Subscription;
  public screenHeight: number;
  public tableBodyHeight: number; // initalized in ngAfterViewInit

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  public ietsdata: Array<Object> = [];
  dataSource = new TableVirtualScrollDataSource<any>(this.ietsdata);
  public rowHeight: number = 48;
  public itemsRenderedAtViewport: number;

  constructor(
    private snackBar: MatSnackBar,
    private _entryService: EntryService,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private mediaObserver: MediaObserver,
    private _styleService: StyleService,
    private _cdr: ChangeDetectorRef,
    private _http: HttpClient
  ) {}

    public searchPageNumber: number;
    public searchResults: Array<any>;

  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        if (change.mqAlias == 'xs'){
          this.columnFilterNoteControl.setValue(false);
        } else if (change.mqAlias != 'xs'){
          this.columnFilterNoteControl.setValue(true);
        }
      });
      this.onResize();
      this.searchPageNumber = 0;
      this.searchResults = [];
  }

  ngAfterViewInit() {
    let o1:Observable<boolean> = this.columnFilterWeightControl.valueChanges;
    let o2:Observable<boolean> = this.columnFilterDateControl.valueChanges;
    let o3:Observable<boolean> = this.columnFilterNoteControl.valueChanges;
    let o4:Observable<boolean> = this.columnFilterActionsControl.valueChanges;
 
    merge(o1, o2, o3, o4).subscribe( v=>{
    this.columnDefinitions[0].show = this.columnFilterWeightControl.value;
    this.columnDefinitions[1].show = this.columnFilterDateControl.value;
    this.columnDefinitions[2].show = this.columnFilterNoteControl.value;
    this.columnDefinitions[3].show = this.columnFilterActionsControl.value;
      //  console.log(this.columnDefinitions);
     });
     this.tableBodyHeight = this.screenHeight - this._styleService.headerHeight;
     this.itemsRenderedAtViewport = Math.round((this.tableBodyHeight - 56) / this.rowHeight);

    // this.pageSize = this.virtualScroll.getRenderedRange().end-this.itemsRenderedAtViewport;
    // this.pageSize = this.itemsRenderedAtViewport * 2;
    this.pageSize = this.itemsRenderedAtViewport; 
    this.onScrollDown();
    this.dataSource.sort = this.sort;
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

  onScrollUp(): void{
    console.log(this.renderedPageNumbers)
    console.log(this.renderedPages)
    console.log('reachedTop=' + this.reachedTop)
    if (this.renderedPageNumbers[0] == 0){
      return;
    }
    var prevPageNumber = this.renderedPageNumbers[0]-1;
    this._http.get('http://localhost:5000/bas?pageNo=' + prevPageNumber + '&pageSize=' + this.pageSize).subscribe(
      (entries: entry[]) => {   
        this.renderedPages.unshift(entries);      
        const data = this.dataSource.data;
        entries.forEach(item => data.unshift(item));
        this.dataSource.data = data;
        this.renderedPageNumbers.unshift(prevPageNumber)
        if (this.renderedPageNumbers.length > this.maxPagesToRender){
            this.renderedPageNumbers.pop();
            let entryIdsToRemove = [];
            this.renderedPages.pop().forEach(
              entry => {
                entryIdsToRemove.push(entry['id']);
              }
            )
            this.dataSource.data = this.dataSource.data.filter(
              entry => {
                return !entryIdsToRemove.includes(entry['id']);
              }
            );
        }
        if (entries.length != this.pageSize){
          this.reachedBottom = true;
        }  
        if (this.renderedPageNumbers[this.renderedPageNumbers.length-1] != 7){
          this.reachedBottom = false;
          console.log("BOTTOM NIET BEREIKT!")
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  onScrollDown(): void{
    console.log('reachedBottom=' + this.reachedBottom)
    if (this.reachedBottom == true){
      return;
    }
    var nextPageNumber = this.renderedPageNumbers[this.renderedPageNumbers.length-1];
    if (nextPageNumber == undefined){
      console.log('ja het is undifned')
      nextPageNumber = 0;
    } else {
      nextPageNumber++;
    }
    console.log('nextPageNumber= ' + nextPageNumber);
    console.log(this.renderedPageNumbers)
    this._http.get('http://localhost:5000/bas?pageNo=' + nextPageNumber + '&pageSize=' + this.pageSize).subscribe(
      (entries: entry[]) => {   
        this.renderedPages.push(entries);      
        const data = this.dataSource.data;
        entries.forEach(item => data.push(item));
        this.dataSource.data = data;
        this.renderedPageNumbers.push(nextPageNumber)
        if (this.renderedPageNumbers.length > this.maxPagesToRender){
            this.renderedPageNumbers.shift();
            let entryIdsToRemove = [];
            this.renderedPages.shift().forEach(
              entry => {
                entryIdsToRemove.push(entry['id']);
              }
            )
            this.dataSource.data = this.dataSource.data.filter(
              entry => {
                return !entryIdsToRemove.includes(entry['id']);
              }
            );
        }
        if (entries.length != this.pageSize){
          this.reachedBottom = true;
          this.lastPageNumber = nextPageNumber;
        }
        // console.log('last rendered page=' + this.renderedPageNumbers[this.renderedPageNumbers.length-1])
      },
      (error) => {
        console.log(error)
      }
    );
  } 

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      // this.tableBodyHeight = this.screenHeight - this._styleService.headerHeight; // this doesn't work for some reason. Need to retrigger something else.
    }

  editEntry(id: number, weight: number, date: string, note: string): void{
    const bottomSheetRef = this._bottomSheet.open(AddEntrySheet, {
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
  }

}