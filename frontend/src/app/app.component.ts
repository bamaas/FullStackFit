import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

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
  ){

  }

  async ngOnInit(){
    if (await this.keycloak.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      await this.login();
    }

    /**
     * Whenever the token expires and a refresh token is available, try to refresh the access token.
     * Otherwise, redirect to login.
    */
    const keycloakAuth = this.keycloak.getKeycloakInstance();
    keycloakAuth.onTokenExpired = () => {
      if (keycloakAuth.refreshToken) {
          this.keycloak.updateToken();
      } else {
          this.login();
      }
    };

    this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        console.log(change.mqAlias);
      }
    );
  }

  public login(): void{
    this.keycloak.login({ redirectUri: window.location.origin });
  }

  ngAfterViewInit(){

  }

}
