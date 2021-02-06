import { Component, OnInit, ViewChild, ElementRef, Inject, forwardRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntryService, Entry } from '../../../services/entry.service';
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
      data: {title: 'Add entry...', btn_cancel: 'Cancel', btn_confirm: 'Add', entry: null}
    });
  }

}

import { PickDateAdapter, PICK_FORMATS } from 'src/app/shared/pick-date-adapter'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { ProfileService } from 'src/app/services/profile.service';
import { Subject } from 'rxjs';

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
    private profileService: ProfileService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  public entryForm: FormGroup;
  public circumferenceForm: FormGroup;
  public skinfoldForm: FormGroup;

  ngOnInit(): void {
    this.initEntryForm(this.data.entry);
  }

  private initCircumreferenceForm(entry: Entry): void{
    const waist: Number = entry == null ? null : entry.circumference.waist;
    const neck: Number = entry == null ? null : entry.circumference.neck;
    const arm: Number = entry == null ? null : entry.circumference.arm;
    const leg: Number = entry == null ? null : entry.circumference.leg;
    const chest: Number = entry == null ? null : entry.circumference.chest;
    const calf: Number = entry == null ? null : entry.circumference.calf;
    this.circumferenceForm = new FormGroup({
      waist: new FormControl(waist, [Validators.min(0), Validators.max(400)]),
      neck: new FormControl(neck, [Validators.min(0), Validators.max(100)]),
      arm: new FormControl(arm, [Validators.min(0), Validators.max(100)]),
      chest: new FormControl(chest, [Validators.min(0), Validators.max(400)]),
      calf: new FormControl(calf, [Validators.min(0), Validators.max(100)]),
      leg: new FormControl(leg, [Validators.min(0), Validators.max(400)])
    })
  }

  private initSkinfoldForm(entry): void{
    const chest: Number = entry == null ? null : entry.skinfold.chest;
    const abdominal: Number = entry == null ? null : entry.skinfold.abdominal;
    const thigh: Number = entry == null ? null : entry.skinfold.thigh;
    const biceps: Number = entry == null ? null : entry.skinfold.biceps;
    const triceps: Number = entry == null ? null : entry.skinfold.triceps;
    const calf: Number = entry == null ? null : entry.skinfold.calf;
    this.skinfoldForm = new FormGroup({
      chest: new FormControl(chest, [Validators.min(0), Validators.max(300)]),
      abdominal: new FormControl(abdominal, [Validators.min(0), Validators.max(300)]),
      thigh: new FormControl(thigh, [Validators.min(0), Validators.max(300)]),
      biceps: new FormControl(biceps, [Validators.min(0), Validators.max(300)]),
      triceps: new FormControl(triceps, [Validators.min(0), Validators.max(300)]),
      calf: new FormControl(calf, [Validators.min(0), Validators.max(300)])
    })
  }

  initEntryForm(entry: Entry): void{
    this.initCircumreferenceForm(entry);
    this.initSkinfoldForm(entry);
    const weight: Number = entry == null ? null : entry.weight;
    const note: String = entry == null ? null : entry.note;
    let date = new Date();
    let time: String;
    if (entry === null){
      // If new entry
      time = moment(date).format('HH:mm');
    } else {
      // If editing entry
      date = moment(entry.date, 'YYYY-MM-DD').toDate();
      time = moment(entry.date).format('HH:mm');
    }
    this.entryForm = new FormGroup({
      weight: new FormControl(weight, [Validators.required, Validators.min(0), Validators.max(200), Validators.pattern(new RegExp(/^\d{0,3}(?:\.\d)?$/))]),
      date: new FormControl(date),
      time: new FormControl(time, [Validators.pattern(new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/))]),
      note: new FormControl(note, Validators.maxLength(50)),
      circumference: this.circumferenceForm,
      skinfold: this.skinfoldForm
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

  private _submitEnabled = true;

  submit(): void{
    if (!this.entryForm.invalid && this._submitEnabled){
      const skinfold = {
        chest: this.entryForm.get('skinfold.chest').value,
        abdominal: this.entryForm.get('skinfold.abdominal').value,
        thigh: this.entryForm.get('skinfold.thigh').value,
        calf: this.entryForm.get('skinfold.calf').value,
        biceps: this.entryForm.get('skinfold.biceps').value,
        triceps: this.entryForm.get('skinfold.triceps').value
      }
      const circumference = {
        chest: this.entryForm.get('circumference.chest').value,
        leg: this.entryForm.get('circumference.leg').value,
        arm: this.entryForm.get('circumference.arm').value,
        waist: this.entryForm.get('circumference.waist').value,
        calf: this.entryForm.get('circumference.calf').value,
        neck: this.entryForm.get('circumference.neck').value
      }
      const id: number = this.data.entry == null ? null : this.data.entry.id;
      const weight: number = this.entryForm.controls['weight'].value;
      const note: string = this.entryForm.controls['note'].value;
      const date = moment(new Date(this.entryForm.controls['date'].value)).format('YYYY-MM-DD');
      const time = this.entryForm.controls['time'].value;
      const datetime = date + 'T' + time;
      const entry: Entry = { 
        id: id,
        weight: weight, 
        date: datetime, 
        circumference: circumference,
        skinfold: skinfold,
        note: note 
      };
      if (id != null){
        this.edit(entry);
      } else {
        this.add(entry);
        this._submitEnabled = false;
        setTimeout(f => this._submitEnabled = true, 1000);
      }
    }
  }

  edit(entry: Entry): void{
    this._entryService.editEntryOnTable(entry);
    this._bottomSheetRef.dismiss();
  }
  
  add(entry: Entry): void{
      this._entryService.addEntryToPage(entry);
      this._bottomSheetRef.dismiss();
    } 
}