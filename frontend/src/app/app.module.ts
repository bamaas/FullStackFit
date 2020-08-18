import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
// See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { tdeeCalculator } from './tdee-calculator/tdee-calculator.component';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { FooterComponent } from './footer/footer.component';
import { TdeeResultsComponent } from './tdee-results/tdee-results.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogDataExampleDialog } from './dialog/dialog.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { BottomSheetOverviewExampleSheet } from './bottom-sheet/bottom-sheet.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { CalorieCalculatorComponent } from './calorie-calculator/calorie-calculator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { EntriesComponent } from './progress-tracker/entries/entries.component';
import { AddEntryComponent } from './progress-tracker/entries/add-entry/add-entry.component';
import { AddEntrySheet } from './progress-tracker/entries/add-entry/add-entry.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { FilterColumnsComponent } from './progress-tracker/entries/filter-columns/filter-columns.component'

@NgModule({
  declarations: [
    AppComponent,
    tdeeCalculator,
    NavComponent,
    FooterComponent,
    TdeeResultsComponent,
    DialogComponent,
    DialogDataExampleDialog,
    BottomSheetComponent,
    BottomSheetOverviewExampleSheet,
    HeaderComponent,
    routingComponents,
    CalorieCalculatorComponent,
    ProgressTrackerComponent,
    EntriesComponent,
    AddEntryComponent,
    AddEntrySheet,
    AlertDialogComponent,
    FilterColumnsComponent
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
    FlexLayoutModule
  ],
  providers: [AddEntryComponent, FilterColumnsComponent],
  bootstrap: [AppComponent],
  entryComponents: [DialogDataExampleDialog, BottomSheetOverviewExampleSheet, AddEntrySheet, AlertDialogComponent]
})
export class AppModule { }
