import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'from'
})
export class FromPipe implements PipeTransform {

  transform(from: string, args?: any): string {
    if (from) {
      return from.replace(/<.*>/, "");
    }
    return "Unknown Sender";
  }

}
