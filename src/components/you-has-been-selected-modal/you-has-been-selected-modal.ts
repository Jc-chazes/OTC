import { Component } from '@angular/core';

/**
 * Generated class for the YouHasBeenSelectedModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'you-has-been-selected-modal',
  templateUrl: 'you-has-been-selected-modal.html'
})
export class YouHasBeenSelectedModalComponent {

  text: string;

  constructor() {
    console.log('Hello YouHasBeenSelectedModalComponent Component');
    this.text = 'Hello World';
  }

}
