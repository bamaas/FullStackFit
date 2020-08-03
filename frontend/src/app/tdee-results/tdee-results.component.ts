import { Component, ViewChild } from '@angular/core';
import { TDEEService } from '../tdee.service';
import { Subscription } from 'rxjs';
import { ChartType } from 'chart.js'
import { BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-tdee-results',
  templateUrl: './tdee-results.component.html',
  styleUrls: ['./tdee-results.component.css']
})
export class TdeeResultsComponent {

  // TDEE & BMR & Results
  messageServiceTDEE: any;
  subscriptionServiceTDEE: Subscription;
  // Macro table
  //messageServiceMacroTable: any;
  subscriptionServiceMacroTable: Subscription;

  // Table
  displayedColumns: string[] = ['name', 'gram', 'kcal', 'percentage'];
  messageServiceMacroTable: any =   [
    {name: 'Protein', gram: 100, kcal: 200, percentage: 30},
    {name: 'Carbohydrates', gram: 50, kcal: 100, percentage: 50},
    {name: 'Fat', gram: 40, kcal: 500, percentage: 20},
  ];

  constructor(private TDEEService: TDEEService) {
    // subscribe to tdee service
    this.messageServiceTDEE = { 'results': false };
    this.subscriptionServiceTDEE = this.TDEEService.get_tdee_calculator_result().subscribe(
      message => {
        this.messageServiceTDEE = message
        this.pieChartData = [[this.messageServiceMacroTable[0]["percentage"], this.messageServiceMacroTable[1]["percentage"], this.messageServiceMacroTable[2]["percentage"]]];
      })
    this.subscriptionServiceMacroTable = this.TDEEService.get_tdee_calculator_result_macro_table().subscribe(message => {this.messageServiceMacroTable = message})
  }

  // Chart
  @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
  public pieChartData: any[] = [{
    data: [[this.messageServiceMacroTable[0]["percentage"], this.messageServiceMacroTable[1]["percentage"], this.messageServiceMacroTable[2]["percentage"]]]
  }];
  public pieChartType: ChartType = 'pie';
  public pieChartLabels: Label[] = ['Protein', 'Carbohydrates', 'Fats'];
  public pieChartColors: any[] = [{ backgroundColor:["#ff4081", "#3f51b5", "#03DAC6"] }];

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscriptionServiceTDEE.unsubscribe();
      this.subscriptionServiceMacroTable.unsubscribe();
  }

}
