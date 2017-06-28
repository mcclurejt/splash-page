import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit, OnDestroy {

  date;
  id;

  constructor() {
  }


  ngOnInit() {
    this.id = setInterval(() => {
      this.date = new Date();
    }, 1000)
  }

  ngOnDestroy() {
    if (this.id){
      clearInterval(this.id);
    }
  }


}
