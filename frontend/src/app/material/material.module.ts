import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatInputModule,
  MatToolbarModule,
  MatRadioModule,
  MatSelectModule,
  MatButtonModule,
  MatStepperModule,
  MatTableModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDividerModule,
  MatIconModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatListModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule
  ],
  exports: [
    MatInputModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule
  ]
})
export class MaterialModule { }
