import { Component } from '@angular/core';

/**
 * Generated class for the BackButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'back-button',
  templateUrl: 'back-button.html'
})
export class BackButtonComponent {

  text: string;

  constructor() {
    console.log('Hello BackButtonComponent Component');
    this.text = 'Hello World';
  }

}
