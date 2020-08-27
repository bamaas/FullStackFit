import { Component, OnInit } from '@angular/core';
import { tdeeCalculator } from '../tdee-calculator/tdee-calculator.component';
import { TdeeResultsComponent } from '../tdee-results/tdee-results.component';

@Component({
  selector: 'app-calorie-calculator',
  templateUrl: './calorie-calculator.component.html',
  styleUrls: ['./calorie-calculator.component.css']
})
export class CalorieCalculatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
