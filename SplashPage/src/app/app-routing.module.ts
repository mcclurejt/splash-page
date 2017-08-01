import { CalendarTabComponent } from './+calendar-tab/calendar-tab.component';
import { HomeComponent } from './+home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'calendar', component: CalendarTabComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
