import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  logs: Object;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getLogs()
  }

  logForm = new FormGroup({
    weight: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
  });

  postLog(){
      this.http.post(environment.apiBaseUrl + '/log', {"weight": this.logForm.controls['weight'].value}).subscribe(
        response => {
          this.getLogs()
          this.logForm.controls['weight'].reset()
        }, 
        error => {this.snackBar.open('Error occured while adding log.', 'Dismiss', {duration: 6000})}
      )
  }

  getLogs(){
    this.http.get(environment.apiBaseUrl + '/log').subscribe(
        response => {this.logs = response;}, 
        error => {this.snackBar.open('Error occured while retrieving log data.', 'Dismiss', {duration: 6000})}
    )
  }

}
