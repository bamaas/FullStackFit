import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntryService } from '../../entry.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

  constructor(private _addEntrySheet: MatBottomSheet) { }

  faPlus = faPlus;

  ngOnInit(): void {
  }

  openAddEntrySheet(): void {
    this._addEntrySheet.open(AddEntrySheet,{
      data: {title: 'Add entry...', btn_cancel: 'Cancel', btn_confirm: 'Add'}
    });
  }

}

import { PickDateAdapter, PICK_FORMATS } from 'src/app/shared/pick-date-adapter'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import * as moment from 'moment';


@Component({
  selector: 'app-add-entry-sheet',
  templateUrl: 'add-entry-sheet.html',
  styleUrls: ['./add-entry-sheet.css'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
  ]
})
export class AddEntrySheet implements OnInit{

  @ViewChild('inputWeight') inputWeightElement: ElementRef;

  date: any;
  weight: number = this.data.weight
  note: string = this.data.note

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddEntrySheet>, 
    private _entryService: EntryService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  ngOnInit(): void{
    console.log(this.data.date)
    if (this.data.date == null){
      console.log("debug")
      this.date = new Date();
    } else {
      this.date = this.data.date
    }
    console.log(this.date)
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.inputWeightElement.nativeElement.focus());
  }

  public entryForm = new FormGroup({
    weight: new FormControl(this.weight, [Validators.required, Validators.min(0), Validators.max(200)]),
    date: new FormControl(new Date()),
    note: new FormControl(this.note)
  });

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  cancel(): void{
    this._bottomSheetRef.dismiss();
  }

  add(): void{
    if (!this.entryForm.invalid){
      this.inputWeightElement.nativeElement.focus();
      const weight: number = this.entryForm.controls['weight'].value  
      const date: string = moment(new Date(this.entryForm.controls['date'].value)).format("DD-MM-YYYY")
      this._entryService.postEntry(weight, date).subscribe(
        body => {
          this.cancel();
          this._entryService.getEntries();
        }, 
        error => {
          this._snackBar.open('Error occured while adding entry.', 'Dismiss', {duration: 6000})
          console.log(error)
        }
      )
    } 
  }
}