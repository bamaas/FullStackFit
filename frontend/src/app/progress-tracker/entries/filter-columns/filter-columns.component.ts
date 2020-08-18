import { Component, OnInit } from '@angular/core';
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Observable, merge } from 'rxjs';

@Component({
  selector: 'app-filter-columns',
  templateUrl: './filter-columns.component.html',
  styleUrls: ['./filter-columns.component.css']
})
export class FilterColumnsComponent implements OnInit {

  faFilter = faFilter;

  constructor() { }

  ngOnInit(): void {
  }
  
  public columnFilterFormGroup: FormGroup = new FormGroup({
    weight: new FormControl(true),
    date: new FormControl(true),
    note: new FormControl(true),
    actions: new FormControl(true)
  });

  public columnFilterWeightControl: AbstractControl = this.columnFilterFormGroup.get('weight');
  public columnFilterDateControl: AbstractControl = this.columnFilterFormGroup.get('date');
  public columnFilterNoteControl: AbstractControl = this.columnFilterFormGroup.get('note');
  public columnFilterActionsControl: AbstractControl = this.columnFilterFormGroup.get('actions');

  columnDefinitions = [
    { def: 'weight', label: 'Weight', show: this.columnFilterWeightControl.value},
    { def: 'date', label: 'Date', show: this.columnFilterDateControl.value},
    { def: 'note', label: 'Note', show: this.columnFilterNoteControl.value},
    { def: 'actions', label: 'Actions', show: this.columnFilterActionsControl.value}
  ]

  // Returns an array of all the columnDefinitions objects that have the key 'show' set to true
  public getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd=>cd.show).map(cd=>cd.def);
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
       console.log(this.columnDefinitions);
     });
   }

}
