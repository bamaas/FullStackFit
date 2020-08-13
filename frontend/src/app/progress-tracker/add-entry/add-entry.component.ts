import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntryService } from '../entry.service'
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
    this._addEntrySheet.open(AddEntrySheet);
  }

}

import { PickDateAdapter, PICK_FORMATS } from 'src/app/shared/pick-date-adapter'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
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
export class AddEntrySheet {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddEntrySheet>, 
    private _entryService: EntryService,
    private _snackBar: MatSnackBar
  ) {}

  public entryForm = new FormGroup({
    weight: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
    date: new FormControl(new Date())
  });

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  cancel(): void{
    this._bottomSheetRef.dismiss();
  }

  add(): void{
    const weight: number = this.entryForm.controls['weight'].value 
    const date: string = moment(new Date(this.entryForm.controls['date'].value)).format("DD-MM-YYYY")
    this._entryService.postEntry(weight, date).subscribe(
      body => {
        this.cancel();
      }, 
      error => {
        this._snackBar.open('Error occured while adding entry.', 'Dismiss', {duration: 6000})
      }
    )
  }
}