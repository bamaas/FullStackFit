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

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddEntrySheet>, 
    private _entryService: EntryService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  public entryForm: FormGroup;

  ngOnInit(): void{
    this.entryForm = this.initEntryForm(this.data.weight, this.data.date, this.data.note);
  }

  initEntryForm(weight: number, date: any, note: string): FormGroup{
    if (date == null){
      date = new Date();
    } else {
      date = moment(date, 'DD-MM-YYYY').toDate();
    }
    return new FormGroup({
      weight: new FormControl(weight, [Validators.required, Validators.min(0), Validators.max(200), Validators.pattern(new RegExp(/^\d{0,3}(?:\.\d)?$/))]),
      date: new FormControl(date),
      note: new FormControl(note)
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.inputWeightElement.nativeElement.focus());
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  cancel(): void{
    this._bottomSheetRef.dismiss();
  }

  submit(): void{
    if (!this.entryForm.invalid){
      const id: number = this.data.id;
      const weight: number = this.entryForm.controls['weight'].value;
      const date: string = moment(new Date(this.entryForm.controls['date'].value)).format("DD-MM-YYYY");
      const note: string = this.entryForm.controls['note'].value;
      if (id != null){
        this.edit(id, weight, date, note);
      } else {
        this.add(weight, date, note);
      }
    }
  }

  edit(id:number, weight:number, date:string, note:string): void{
    this._entryService.editEntry(id, weight, date, note).subscribe(
      body => {
        this.cancel();
        this._entryService.getEntries();
      }, 
      error => {
        this._snackBar.open('Error occured while updating entry.', 'Dismiss', {duration: 6000})
        console.log(error)
      }
    ) 
  }

  add(weight:number, date:string, note:string): void{
      this._entryService.postEntry(weight, date, note).subscribe(
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