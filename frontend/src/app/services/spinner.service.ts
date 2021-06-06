import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public spinnerObservable: Observable<boolean> = this.spinnerSubject.asObservable();

  constructor() { }

  public showSpinner(value: boolean){
    this.spinnerSubject.next(value);
  }


}
