import { Component } from '@angular/core';

/**
 * Generated class for the TermsAndConditionsModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'terms-and-conditions-modal',
  templateUrl: 'terms-and-conditions-modal.html'
})
export class TermsAndConditionsModalComponent {

  text: string;

  constructor() {
    console.log('Hello TermsAndConditionsModalComponent Component');
    this.text = 'Hello World';
  }

}
