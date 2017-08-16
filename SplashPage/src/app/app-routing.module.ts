import { CalendarTabComponent } from './+calendar-tab/calendar-tab.component';
import { HomeComponent } from './+home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailTabComponent } from "app/+mail-tab/mail-tab.component";

const routes: Routes = [
  {path: 'home', pathMatch: 'full', component: HomeComponent},
  {path: 'calendar', component: CalendarTabComponent},
  {path: 'mail', component: MailTabComponent},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
