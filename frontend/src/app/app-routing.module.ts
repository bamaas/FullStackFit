import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryDetailComponent } from './progress-tracker/entries/entry-detail/entry-detail.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component'
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  { path: 'entries', component: ProgressTrackerComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: '', component: ProgressTrackerComponent },
  { path: 'entry/:id', component: EntryDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ProgressTrackerComponent]    // See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup