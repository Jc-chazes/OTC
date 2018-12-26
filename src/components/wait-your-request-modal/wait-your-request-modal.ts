import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the WaitYourRequestModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wait-your-request-modal',
  templateUrl: 'wait-your-request-modal.html'
})
export class WaitYourRequestModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello WaitYourRequestModalComponent Component');
    this.text = 'Hello World';
  }

}
