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
  MatListModule,
  MatPaginatorModule,
  MatSortModule,
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
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
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
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class MaterialModule { }
