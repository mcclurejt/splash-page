import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  isScrollLoading=false;

  constructor() { }

  ngOnInit() {
  }

  onScrollDown(){
    console.log('Scrolled Down!');
  }

}
