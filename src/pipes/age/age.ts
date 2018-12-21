import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AgePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Date, ...args) {
    if( !value ) return null;
    var ageDifMs = Date.now() - value.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
