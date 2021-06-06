import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleService {


  private screenHeightSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public screenHeightObservable: Observable<number> = this.screenHeightSubject.asObservable();

  constructor() { }

  public setScreenHeight(height: number){
    this.screenHeightSubject.next(height);
  }

}