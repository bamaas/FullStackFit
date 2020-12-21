import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddEntryComponent } from '../progress-tracker/entries/add-entry/add-entry.component';
import { faUser, faHistory, faChartBar, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ProfileService } from '../services/profile.service'
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  public userInfo: any = null;

  constructor(
    private addEntryComponent: AddEntryComponent,
    private profileService: ProfileService
  )
  {}

  ngOnInit() {
    this.getUserProfile();
  }

  @ViewChild('mainHeader', {read: ElementRef, static:false}) mainHeaderElement: ElementRef;

  public headerHeight: number;
  public faUser = faUser;
  public faHistory = faHistory;
  public faSignOut = faSignOutAlt;
  public faChartBar = faChartBar;

  openAddEntryDialog(): void{
    this.addEntryComponent.openAddEntrySheet();
  }

  ngAfterViewInit(): void{
    this.headerHeight = this.mainHeaderElement.nativeElement.offsetHeight;
  }

  getUserProfile(): void{
    this.profileService.userInfo.subscribe(userInfo => {this.userInfo = userInfo})
  }

  public logout(): void {
    this.profileService.logout();
  }

}
