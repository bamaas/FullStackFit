import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
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
    BottomSheetOverviewExampleSheet
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
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogDataExampleDialog, BottomSheetOverviewExampleSheet]
})
export class AppModule { }
