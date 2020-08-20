import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { StyleService } from 'src/app/style.service'

@Component({
  providers: [BottomSheetComponent],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private bottomsheetcomponent: BottomSheetComponent, 
    private _addEntryComponent: AddEntryComponent,
    private _styleService: StyleService
  )
  {}

  ngOnInit(): void {
  }

  @ViewChild('mainHeader', {read: ElementRef, static:false}) mainHeaderElement: ElementRef;

  public headerHeight: number;

  open_bottom_sheet(): void{
    this.bottomsheetcomponent.openBottomSheet('pieter');
  }

  openAddEntryDialog(): void{
    this._addEntryComponent.openAddEntrySheet();
  }

  ngAfterViewInit(): void{
    this.headerHeight = this.mainHeaderElement.nativeElement.offsetHeight;
    this._styleService.headerHeight = this.headerHeight;
  }
}
