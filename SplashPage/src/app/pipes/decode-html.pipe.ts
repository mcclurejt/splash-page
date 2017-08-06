import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHTML'
})
export class DecodeHTMLPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value) {
      let text = document.createElement("textarea");
      text.innerHTML = value;
      return text.value;
    }
    return "";
  }

}
