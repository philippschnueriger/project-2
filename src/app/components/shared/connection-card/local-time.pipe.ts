import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
        const date = new Date(value);
        const hours = ('0' + date.getUTCHours()).slice(-2); // Extract UTC hours
        const minutes = ('0' + date.getUTCMinutes()).slice(-2); // Extract UTC minutes
        return hours + ':' + minutes;
      }
      return null;
    }
}
