import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { StyleService } from 'src/app/services/style.service'
import { faUser, faHistory, faChartBar, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  public userProfile: KeycloakProfile | null = null;

  constructor(
    private _addEntryComponent: AddEntryComponent,
    private _styleService: StyleService,
    private readonly keycloak: KeycloakService
  )
  {}

  async ngOnInit(): Promise<void> {
    this.userProfile = await this.keycloak.loadUserProfile();
  }

  @ViewChild('mainHeader', {read: ElementRef, static:false}) mainHeaderElement: ElementRef;

  public headerHeight: number;
  public faUser = faUser;
  public faHistory = faHistory;
  public faSignOut = faSignOutAlt;
  public faChartBar = faChartBar;

  openAddEntryDialog(): void{
    this._addEntryComponent.openAddEntrySheet();
  }

  ngAfterViewInit(): void{
    this.headerHeight = this.mainHeaderElement.nativeElement.offsetHeight;
    this._styleService.headerHeight = this.headerHeight;
  }

  public logout(): void {
    this.keycloak.logout();
  }

}
