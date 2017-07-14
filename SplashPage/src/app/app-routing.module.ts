import { SignInGuard } from './services/sign-in.guard';
import { RootGuard } from './services/root.guard';
import { SignInComponent } from './+sign-in/sign-in.component';
import { HomeComponent } from './+home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent, canActivate: [RootGuard] },
  {path: 'signin', component: SignInComponent, canActivate: [SignInGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
