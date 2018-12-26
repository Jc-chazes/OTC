import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the RequestWasAcceptedModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'request-was-accepted-modal',
  templateUrl: 'request-was-accepted-modal.html'
})
export class RequestWasAcceptedModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello RequestWasAcceptedModalComponent Component');
    this.text = 'Hello World';
  }

}
