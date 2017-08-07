import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subject'
})
export class SubjectPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value === "") {
      return "No Subject";
    }
    return value;
  }

}
