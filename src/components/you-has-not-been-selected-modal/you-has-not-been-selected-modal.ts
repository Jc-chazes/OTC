import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the YouHasNotBeenSelectedModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'you-has-not-been-selected-modal',
  templateUrl: 'you-has-not-been-selected-modal.html'
})
export class YouHasNotBeenSelectedModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello YouHasNotBeenSelectedModalComponent Component');
    this.text = 'Hello World';
  }

}
