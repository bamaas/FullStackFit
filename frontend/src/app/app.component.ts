import { Component, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { KeycloakService } from 'keycloak-angular';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { ProfileService } from './services/profile.service';
import { SidenavService } from './services/sidenav.service';
import { MatSidenav } from '@angular/material';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import * as Keycloak from 'keycloak-ionic';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{

  public isLoggedIn = false;
  public userInfo: any = null;
  public faUserCircle = faUserCircle;
  
  @ViewChild('sidenav') public sidenav: MatSidenav;

  public keycloak: Keycloak.KeycloakInstance;
  public authSuccess: boolean;
  public userProfile: Keycloak.KeycloakProfile;

  constructor(
    private mediaObserver: MediaObserver,
    private profileService: ProfileService,
    private addEntryComponent: AddEntryComponent,
    private sidenavService: SidenavService,
    private changeRef: ChangeDetectorRef
  ){

  }

  async ngOnInit(): Promise<void>{

    this.keycloak = Keycloak({
      url: environment.authBaseUrl,
      realm: 'FitTrack',
      clientId: 'fittrack-application'
    });

    this.keycloak.init({
      adapter: 'capacitor-native',
      responseMode: 'query',
      redirectUri: 'angu://home'
    });

    console.log('Loggedin: ' + this.authSuccess);
    if (!this.authSuccess) this.login();

    this.keycloak.onAuthSuccess = () => {
      console.log('login');
      this.authSuccess = true;
      this.changeRef.detectChanges();
    };

    this.keycloak.onAuthLogout = () => {
      console.log('logout');
      this.authSuccess = false;
      this.userProfile = null;
      this.changeRef.detectChanges();
    };

    this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        console.log(change.mqAlias);
      }
    );

  }

  login(): void {
    this.keycloak.login();
  }

  loadProfile(): void {
    this.keycloak.loadUserProfile().then(profile => {
      this.userProfile = profile;
      this.changeRef.detectChanges();
    });
  }

  logout(): void {
    this.keycloak.logout();
  }
  

  getUserProfile(): void{
    this.profileService.userInfo.subscribe(userInfo => {this.userInfo = userInfo})
  }

  addEntry(): void{
    this.addEntryComponent.openAddEntrySheet();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  navigateGithub(){
    window.open('https://github.com/bamaas/FullStackFit', '_blank');
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

}
