import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TDEEService implements OnInit{

  apiURL = environment.apiBaseUrl;

  // TDEE & BMR
  private tdeeCalculatorSubject = new Subject<any>();

  constructor(private http: HttpClient, private _snackBar: MatSnackBar){
  }

  ngOnInit(){
  }

    // Tutorial: https://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject
    //    https://rxjs-dev.firebaseapp.com/guide/subject
    // Below are 2 subjects with each one observer
    
    // Macrotable
    private tdeeCalculatorSubjectMacro = new Subject<any>();

    get_tdee_calculator_result_macro_table(): Observable<any>{
      return this.tdeeCalculatorSubjectMacro.asObservable();
    }

    get_tdee_calculator_result(): Observable<any>{
      return this.tdeeCalculatorSubject.asObservable();
    }

    clear_tdee_calculator_result(){
      this.tdeeCalculatorSubject.next({'results':false});
    }

    show_tdee_calculator_result(){
      this.tdeeCalculatorSubject.next({'results':true});
    }

    calc(gender, length, weight, age, activityLevel, goal){
      let params = new HttpParams().set('gender', gender).set('length', length).set('weight', weight).set('age', age).set('activityLevel', activityLevel).set('goal', goal);
      this.http.get('http://localhost:5000' + '/calc', {params: params})
      .subscribe(response => {
        this.tdeeCalculatorSubjectMacro.next(
          [
            {name: 'Protein', gram: response['macronutrients']['protein']['gram'], kcal: response['macronutrients']['protein']['kcal'], percentage: response['macronutrients']['protein']['percentage']},
            {name: 'Carbohydrates', gram: response['macronutrients']['carbohydrates']['gram'], kcal: response['macronutrients']['carbohydrates']['kcal'], percentage: response['macronutrients']['carbohydrates']['percentage']},
            {name: 'Fat', gram: response['macronutrients']['fat']['gram'], kcal: response['macronutrients']['fat']['kcal'], percentage: response['macronutrients']['fat']['percentage']},
          ]
        );
        this.tdeeCalculatorSubject.next({'results':true, 'bmr':response['bmr'], 'tdee':response['tdee']});
      }, error => {
        this._snackBar.open('Error while retrieving data from server', 'Dismiss', {
          duration: 6000,
        });
      });
    }
}