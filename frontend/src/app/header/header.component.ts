import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  providers: [BottomSheetComponent],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private bottomsheetcomponent: BottomSheetComponent) { }

  ngOnInit() {
  }

  open_bottom_sheet(){
    this.bottomsheetcomponent.openBottomSheet('pieter');
  }
}
