import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { StyleService } from 'src/app/services/style.service'
import { KeycloakService } from 'keycloak-angular';
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(
    private _addEntryComponent: AddEntryComponent,
    private _styleService: StyleService,
    private readonly keycloak: KeycloakService
  )
  {}

  ngOnInit(): void {
  }

  @ViewChild('mainHeader', {read: ElementRef, static:false}) mainHeaderElement: ElementRef;

  public headerHeight: number;
  public faSignOutAlt = faSignOutAlt;

  openAddEntryDialog(): void{
    this._addEntryComponent.openAddEntrySheet();
  }

  public logout(): void {
    this.keycloak.logout();
  }

  ngAfterViewInit(): void{
    this.headerHeight = this.mainHeaderElement.nativeElement.offsetHeight;
    this._styleService.headerHeight = this.headerHeight;
  }
}
