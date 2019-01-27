import { Component } from '@angular/core';

/**
 * Generated class for the RequestAcceptedComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'request-accepted',
  templateUrl: 'request-accepted.html'
})
export class RequestAcceptedComponent {

  text: string;

  constructor() {
    console.log('Hello RequestAcceptedComponent Component');
    this.text = 'Hello World';
  }

}
