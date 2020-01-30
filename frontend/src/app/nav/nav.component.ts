import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';


@Component({
  providers: [BottomSheetComponent],
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private bottomsheetcomponent: BottomSheetComponent) { }

  ngOnInit() {
  }

  open_bottom_sheet(){
    this.bottomsheetcomponent.openBottomSheet('pieter');
  }

}
