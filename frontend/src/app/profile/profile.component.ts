import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HeaderService } from '../services/header.service';
import { KeycloakProfile } from 'keycloak-js';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public headerTitle = 'My Profile';
  public userInfo: any;
  public faUserCircle = faUserCircle;

  constructor(
    private profileService: ProfileService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.setHeaderTitle();
    this.profileService.userInfo.subscribe(userInfo => {
      this.userInfo = userInfo;
    })
  }

  setHeaderTitle(){
    this.headerService.setHeaderTitle(this.headerTitle);
  }

  signOut(){
    this.profileService.logout();
  }

}
