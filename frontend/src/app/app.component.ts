import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { KeycloakService } from 'keycloak-angular';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{

  public isLoggedIn = false;

  constructor(
    private readonly keycloak: KeycloakService,
    private mediaObserver: MediaObserver,
    private profileService: ProfileService,
    private addEntryComponent: AddEntryComponent,
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

  addEntry(): void{
    this.addEntryComponent.openAddEntrySheet();
  }

  ngAfterViewInit(){

  }

}
