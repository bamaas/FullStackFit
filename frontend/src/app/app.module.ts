import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
// See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { EntriesComponent } from './progress-tracker/entries/entries.component';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { AddEntrySheet } from './progress-tracker/entries/add-entry/add-entry.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { FilterColumnsComponent } from './progress-tracker/entries/filter-columns/filter-columns.component'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsComponent } from './statistics/statistics.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { EntryDetailComponent } from './progress-tracker/entries/entry-detail/entry-detail.component';
import { SidenavService } from './services/sidenav.service';
import { ProfileComponent } from './profile/profile.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.authBaseUrl,
        realm: 'FitTrack',
        clientId: 'fittrack-application',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    routingComponents,
    AddEntrySheet,
    ProgressTrackerComponent,
    EntriesComponent,
    AddEntryComponent,
    AlertDialogComponent,
    FilterColumnsComponent,
    TruncatePipe,
    StatisticsComponent,
    EntryDetailComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
    FontAwesomeModule,
    FlexLayoutModule,
    ScrollingModule,
    TableVirtualScrollModule,
    InfiniteScrollModule,
    NgxChartsModule,
    KeycloakAngularModule,
    NgxMaterialTimepickerModule.setLocale('nl-NL')
  ],
  providers: [ 
    KeycloakService,
    AddEntryComponent,
    FilterColumnsComponent,
    SidenavService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddEntrySheet, AlertDialogComponent]
})

export class AppModule { }
