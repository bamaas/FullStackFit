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
      // If new entry
      date = new Date();
    } else {
      // If editing entry
      date = moment(date, 'YYYY-MM-DD[T]HH:mm:ss').toDate();
      console.log(date)
    }
    return new FormGroup({
      weight: new FormControl(weight, [Validators.required, Validators.min(0), Validators.max(200), Validators.pattern(new RegExp(/^\d{0,3}(?:\.\d)?$/))]),
      date: new FormControl(date),
      note: new FormControl(note, Validators.maxLength(50))
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
      const note: string = this.entryForm.controls['note'].value;
      if (id != null){
        // If editing etry
        const datetime: string = moment(new Date(this.entryForm.controls['date'].value)).format("YYYY-MM-DD[T]HH:mm:ss");
        this.edit(id, weight, datetime, note);
      } else {
        // If new entry
        // Get current time and add it to the date
        const date: string = moment(new Date(this.entryForm.controls['date'].value)).format("YYYY-MM-DD");
        const time:string = moment().format("HH:mm:ss")
        const datetime: string = date + 'T' + time;
        this.add(weight, datetime, note);
      }
    }
  }

  edit(id:number, weight:number, date:string, note:string): void{
    this._entryService.editEntryOnTable(id, weight, date, note);
    this._bottomSheetRef.dismiss();
  }
  
  add(weight:number, date:string, note:string): void{
      this._entryService.addEntryToPage(weight, date, note);
      this._bottomSheetRef.dismiss();
    } 
}