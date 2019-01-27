import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the ContinueTransactionOrBackModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'continue-transaction-or-back-modal',
  templateUrl: 'continue-transaction-or-back-modal.html'
})
export class ContinueTransactionOrBackModalComponent {

  option: 'CONTINUE' | 'RETURN' = 'CONTINUE';

  constructor(public viewCtrl: ViewController) {
  }

}
