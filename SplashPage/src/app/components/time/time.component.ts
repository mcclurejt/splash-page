import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnDestroy {

  date: any;
  id: any;

  constructor() {
    this.date = new Date()
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
