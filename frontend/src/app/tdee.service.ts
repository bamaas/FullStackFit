import { HttpClient } from '@angular/common/http';
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

    postjson(json_body){
      console.log("Post:", json_body)
      this.http.post(this.apiURL + '/calculate_all', json_body)
      .subscribe(response => {
        console.log("Response:", response)
        this.tdeeCalculatorSubjectMacro.next(
          [
            {name: 'Protein', gram: response['proteinReqGram'], kcal: response['proteinReqKcal'], percentage: response['proteinReqPerc']},
            {name: 'Carbohydrates', gram: response['carbReqGram'], kcal: response['carbReqKcal'], percentage: response['carbReqPerc']},
            {name: 'Fat', gram: response['fatReqGram'], kcal: response['fatReqKcal'], percentage: response['fatReqPerc']},
          ]
        );
        this.tdeeCalculatorSubject.next({'results':true, 'bmr':response['bmr'], 'tdee':response['tdee']});
        // this.tdeeCalculatorSubjectMacro.next(
        //         {'macroTable':[{name: 'Protein', gram: response['proteinReqGram'], kcal: response['proteinReqKcal'], percentage: response['proteinReqPerc']},
        //         {name: 'Carbohydrates', gram: response['carbReqGram'], kcal: response['carbReqKcal'], percentage: response['carbReqPerc']},
        //         {name: 'Fat', gram: response['fatReqGram'], kcal: response['fatReqKcal'], percentage: response['fatReqPerc']},],
        //         'results':true,
        //         'bmr':response['bmr'],
        //         'tdee':response['tdee']
        //       });
      }, error => {
        this._snackBar.open('Error while retrieving data from server', 'Dismiss', {
          duration: 6000,
        });
      });
    }
}