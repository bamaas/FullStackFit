import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { StyleService } from 'src/app/services/style.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private _addEntryComponent: AddEntryComponent,
    private _styleService: StyleService
  )
  {}

  ngOnInit(): void {
  }

  @ViewChild('mainHeader', {read: ElementRef, static:false}) mainHeaderElement: ElementRef;

  public headerHeight: number;

  openAddEntryDialog(): void{
    this._addEntryComponent.openAddEntrySheet();
  }

  ngAfterViewInit(): void{
    this.headerHeight = this.mainHeaderElement.nativeElement.offsetHeight;
    this._styleService.headerHeight = this.headerHeight;
  }
}
