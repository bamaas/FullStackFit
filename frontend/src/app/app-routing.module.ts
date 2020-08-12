import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component'
import { CalorieCalculatorComponent } from './calorie-calculator/calorie-calculator.component';

const routes: Routes = [
  { path: 'progress-tracker', component: ProgressTrackerComponent},
  { path: 'calorie-calculator', component: CalorieCalculatorComponent },
  { path: '', component: ProgressTrackerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ProgressTrackerComponent, CalorieCalculatorComponent]    // See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup