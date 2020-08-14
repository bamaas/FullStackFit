import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';

@Component({
  providers: [BottomSheetComponent],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private bottomsheetcomponent: BottomSheetComponent, private _addEntryComponent: AddEntryComponent) { }

  ngOnInit() {
  }

  open_bottom_sheet(): void{
    this.bottomsheetcomponent.openBottomSheet('pieter');
  }

  openAddEntryDialog(): void{
    this._addEntryComponent.openAddEntrySheet();
  }
}
