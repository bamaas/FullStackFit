import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { KeycloakService } from 'keycloak-angular';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { ProfileService } from './services/profile.service';
import { SidenavService } from './services/sidenav.service';
import { MatSidenav } from '@angular/material';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

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

  constructor(
    private readonly keycloak: KeycloakService,
    private mediaObserver: MediaObserver,
    private profileService: ProfileService,
    private addEntryComponent: AddEntryComponent,
    private sidenavService: SidenavService
  ){

  }

  async ngOnInit(){
    const keycloakInstance = this.profileService.keycloakInstance;

    if (await this.keycloak.isLoggedIn()) {
      this.isLoggedIn = true;
      keycloakInstance.loadUserInfo().then( (userinfo) => {
        this.profileService.updateUserInfo(userinfo);
      });
    } else {
      await this.profileService.login();
    }

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

  navigateGithub(){
    window.open('https://github.com/bamaas/FullStackFit', '_blank');
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

}
