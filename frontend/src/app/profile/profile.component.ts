import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userProfile: KeycloakProfile | null = null;

  constructor(
    private readonly keycloak: KeycloakService
  ) { }

  public logout(): void {
    this.keycloak.logout();
  }

  async ngOnInit(): Promise<void> {
    this.userProfile = await this.keycloak.loadUserProfile();
  }

}
