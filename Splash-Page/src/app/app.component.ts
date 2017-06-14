import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date;
  time: string;

  constructor() {
    this.date = new Date();
    setInterval(() => {
      this.date = new Date();

    }, 1000);
    if (this.date.getHours() >= 11) {
      this.time = (this.date.getHours() - 12).toString()
      this.time += ':'
      if(this.date.getMinutes() < 10){
        this.time += '0' + this.date.getMinutes().toString()
      }
      else{
        this.time += this.date.getMinutes().toString()
      }
      
    }
    else {
      this.time = (this.date.getHours() + 1).toString()
      this.time += ':'
      this.time += this.date.getMinutes()
    }
  }


}
