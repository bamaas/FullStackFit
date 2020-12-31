import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { SidenavService } from '../services/sidenav.service';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private addEntryComponent: AddEntryComponent,
    private sidenavService: SidenavService,
    private headerService: HeaderService
  )
  {}

  ngOnInit() { 
    this.getHeaderTitle();
  }

  public headerHeight: number;
  public headerTitle: string;

  openAddEntryDialog(): void{
    this.addEntryComponent.openAddEntrySheet();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  getHeaderTitle(){
    this.headerService.headerTitle.subscribe(title => {
      this.headerTitle = title;
    })
  }

}
