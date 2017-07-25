import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, len : number): any {
    if(value == null){
      return '';
    }
    if(value.length > (len-3)){
      return value.substring(0,len-3) + '...'
    }
    return value;
  }

}
