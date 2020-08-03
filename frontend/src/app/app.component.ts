import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TDEEService } from './tdee.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TDEEService]
})
export class AppComponent implements OnInit, AfterViewInit{

  constructor(
    private mediaObserver: MediaObserver,
  ){

  }

  ngOnInit(){
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {console.log(change.mqAlias)}
    )
  }

  ngAfterViewInit(){

  }

  private mediaSub: Subscription;


}
