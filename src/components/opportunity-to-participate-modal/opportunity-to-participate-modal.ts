import { Component } from '@angular/core';

/**
 * Generated class for the OpportunityToParticipateModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'opportunity-to-participate-modal',
  templateUrl: 'opportunity-to-participate-modal.html'
})
export class OpportunityToParticipateModalComponent {

  text: string;

  constructor() {
    console.log('Hello OpportunityToParticipateModalComponent Component');
    this.text = 'Hello World';
  }

}
