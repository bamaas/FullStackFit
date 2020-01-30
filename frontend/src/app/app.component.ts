import { Component } from '@angular/core';
import { TDEEService } from './tdee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TDEEService]
})
export class AppComponent {
  title = 'angu';
}
