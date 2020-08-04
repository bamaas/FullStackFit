import { Component, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { faFacebookF, faWhatsapp, faInstagram, faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent {
  
  constructor(private _bottomSheet: MatBottomSheet) {}

  openBottomSheet(naam:string): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
      data: { name: naam }, 
    });
  }

}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetOverviewExampleSheet {

  faFacebookF = faFacebookF;
  faWhatsapp = faWhatsapp;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  faTelegram = faTelegram;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, 
  private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}