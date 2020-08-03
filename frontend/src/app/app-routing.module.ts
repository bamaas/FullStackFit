import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgressComponent } from './progress/progress.component'
import { CalorieCalculatorComponent } from './calorie-calculator/calorie-calculator.component';

const routes: Routes = [
  { path: 'progress-tracker', component: ProgressComponent},
  { path: 'calorie-calculator', component: CalorieCalculatorComponent },
  { path: '', component: CalorieCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ProgressComponent, CalorieCalculatorComponent]    // See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup