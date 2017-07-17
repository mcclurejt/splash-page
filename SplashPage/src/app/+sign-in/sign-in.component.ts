import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent{

  constructor(private authService: AuthService) { 

  }

}
