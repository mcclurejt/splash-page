import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: string, args?: any): string {
    let hours = time.split(':')[0];
    let minutes = time.split(':')[1];

    if (hours == '00') {
      hours = '12';
      minutes += 'am';
      return hours + ':' + minutes;
    }

    let hourNumber = parseInt(hours);
    if (hourNumber == 12) {
      minutes += 'pm';
      return hours + ':' + minutes;
    }

    if (hourNumber > 12){
      hourNumber = hourNumber - 12;
      minutes += 'pm'
      hours = hourNumber + '';
      if(hours.length < 2){
        hours = '0' + hours;
      }
      return hours + ':' + minutes;
    }

    return hours + ':' + minutes + 'am'; 
  }

}
