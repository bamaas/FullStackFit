import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TDEEService } from './_archive/tdee.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TDEEService]
})
export class AppComponent implements OnInit, AfterViewInit{

  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private mediaObserver: MediaObserver,
  ){

  }

  async ngOnInit(){
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    console.log(this.isLoggedIn)
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }

    this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        console.log(change.mqAlias);
      }
    );
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  ngAfterViewInit(){

  }

}
