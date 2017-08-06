import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mailDate'
})
export class MailDatePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value) {
      value = value.replace(/[-+].*\d/, "");
      return value.replace(/\(.*\)/, "");
    }
    return "No Date";
  }

}
