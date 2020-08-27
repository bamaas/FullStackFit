import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  providers: [DialogComponent],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: DialogComponent) { }

  ngOnInit() {
  }

  open_privacy_dialog(){
    this.dialog.openDialog();
  }

}
