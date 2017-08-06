import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'from'
})
export class FromPipe implements PipeTransform {

  transform(from: string, args?: any): string {
    return from.replace(/<.*>/, "");
  }

}
