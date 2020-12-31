import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  public headerTitle = new Subject<string>();

  public setHeaderTitle(title: string){
    this.headerTitle.next(title);
  }

}
