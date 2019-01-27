import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the QuoteAgainModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'quote-again-modal',
  templateUrl: 'quote-again-modal.html'
})
export class QuoteAgainModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello QuoteAgainModalComponent Component');
    this.text = 'Hello World';
  }

}
