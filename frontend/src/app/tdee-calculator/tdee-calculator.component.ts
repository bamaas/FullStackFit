import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TDEEService } from '../tdee.service';

// Typescript to declare the variable types
export interface activityLevel {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-tdee-calculator',
  templateUrl: './tdee-calculator.component.html',
  styleUrls: ['./tdee-calculator.component.css']
})
export class tdeeCalculator implements OnInit {
  
  constructor(private TDEEService: TDEEService) { }

  ngOnInit() {
  }

  userDetails = {}
  results: boolean = false;

  // init forms & variables
  tdee_calculator_form = new FormGroup({
        name: new FormControl('', Validators.minLength(2)),
        gender: new FormControl('', Validators.required),
        weight: new FormControl(null, [Validators.required, Validators.min(30), Validators.max(200)]),
        length: new FormControl(null, [Validators.required, Validators.min(35), Validators.max(225)]),
        age: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(125)]),
        activitylevel: new FormControl(null),
        goal: new FormControl(null)
      }
    );

  click_calculateTDEE(){
    // this.userDetails['name'] = this.tdee_calculator_form.controls['name'].value
    // this.userDetails['gender'] = this.tdee_calculator_form.controls['gender'].value
    // this.userDetails['length'] = this.tdee_calculator_form.controls['length'].value
    // this.userDetails['weight'] = this.tdee_calculator_form.controls['weight'].value
    // this.userDetails['age'] = this.tdee_calculator_form.controls['age'].value
    // this.userDetails['activitylevel'] = this.tdee_calculator_form.controls['activitylevel'].value
    // this.userDetails['goal'] = this.tdee_calculator_form.controls['goal'].value
    let name = this.tdee_calculator_form.controls['name'].value
    let gender = this.tdee_calculator_form.controls['gender'].value
    let length = this.tdee_calculator_form.controls['length'].value
    let weight = this.tdee_calculator_form.controls['weight'].value
    let age = this.tdee_calculator_form.controls['age'].value
    let activityLevel = this.tdee_calculator_form.controls['activitylevel'].value
    let goal = this.tdee_calculator_form.controls['goal'].value
    this.TDEEService.calc(gender, length, weight, age, activityLevel, goal)
  }

  reset(){
    this.tdee_calculator_form.reset()
    this.tdee_calculator_form.markAsUntouched();
    this.tdee_calculator_form.markAsPristine();  
    this.results = false;
    this.TDEEService.clear_tdee_calculator_result();
  }
}