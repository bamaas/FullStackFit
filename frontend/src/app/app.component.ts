import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { KeycloakService } from 'keycloak-angular';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { ProfileService } from './services/profile.service';
import { SidenavService } from './services/sidenav.service';
import { SpinnerService } from './services/spinner.service';
import { MatSidenav } from '@angular/material';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HostListener } from '@angular/core';
import { StyleService } from './services/style.service';
import {Router} from "@angular/router";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [  
        style({opacity:0}),
        animate(0, style({opacity:1})) 
      ]),
      transition(':leave', [  
        animate(500, style({opacity:0})) 
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit{

  public isLoggedIn = false;
  public userInfo: any = null;
  public faUserCircle = faUserCircle;
  public loading: boolean = true;
  @ViewChild('sidenav') public sidenav: MatSidenav;

  constructor(
    private readonly keycloak: KeycloakService,
    private mediaObserver: MediaObserver,
    private profileService: ProfileService,
    private addEntryComponent: AddEntryComponent,
    private sidenavService: SidenavService,
    private spinnerService: SpinnerService,
    private styleService: StyleService,
  ){

  }

  async ngOnInit(): Promise<void>{
    this.onResize();
    this.getSpinner();
    if (await this.keycloak.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      await this.profileService.login();
    }
    const keycloakInstance = this.profileService.keycloakInstance;
    const userInfo: any = await keycloakInstance.loadUserInfo();
    this.profileService.updateUserInfo(userInfo);
    this.getUserProfile();

    /**
     * Whenever the token expires and a refresh token is available, try to refresh the access token.
     * Otherwise, redirect to login.
    */
    keycloakInstance.onTokenExpired = () => {
      console.log('expired '+new Date());
      if (keycloakInstance.refreshToken) {
          this.keycloak.updateToken()
      } else {
          this.profileService.login();
      }
    };

    this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        console.log(change.mqAlias);
      }
    );
  }

  getUserProfile(): void{
    this.profileService.userInfo.subscribe(userInfo => {this.userInfo = userInfo})
  }

  public logout(): void {
    this.profileService.logout();
  }

  addEntry(): void{
    this.addEntryComponent.openAddEntrySheet();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  private getSpinner(): void {
    this.spinnerService.spinnerObservable.subscribe(value => {
      this.loading = value;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.styleService.setScreenHeight(window.innerHeight);
  }

}
