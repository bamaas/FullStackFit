import { Injectable } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo: Observable<any> = this.userInfoSubject.asObservable();
  public keycloakInstance = this.keycloak.getKeycloakInstance();

  constructor(
    private readonly keycloak: KeycloakService
  ) { }

  public updateUserInfo(userInfo: any){
    this.userInfoSubject.next(userInfo);
  }

  public login(redirectUri: string = environment.redirectUrl): void{
    this.keycloak.login({redirectUri: redirectUri});
  }

  public logout(redirectUrl: string = environment.redirectUrl): void{
    this.keycloak.logout(redirectUrl);
  }

}
