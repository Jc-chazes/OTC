import { Component } from '@angular/core';

/**
 * Generated class for the CouldParticipateModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'could-participate-modal',
  templateUrl: 'could-participate-modal.html'
})
export class CouldParticipateModalComponent {

  text: string;

  constructor() {
    console.log('Hello CouldParticipateModalComponent Component');
    this.text = 'Hello World';
  }

}
