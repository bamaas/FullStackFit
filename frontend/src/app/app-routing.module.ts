import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryDetailComponent } from './progress-tracker/entries/entry-detail/entry-detail.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component'
import { StatisticsComponent } from './statistics/statistics.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'log', component: ProgressTrackerComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: '', component: ProgressTrackerComponent },
  { path: 'log/:id', component: EntryDetailComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ProgressTrackerComponent]    // See video: https://www.youtube.com/watch?v=Nehk4tBxD4o how this is setup