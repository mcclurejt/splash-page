import { AuthGuard } from './services/auth.guard';
import { SignInComponent } from './+sign-in/sign-in.component';
import { HomeComponent } from './+home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'signin', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
