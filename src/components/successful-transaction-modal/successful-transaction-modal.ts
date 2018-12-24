import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Transaction } from '../../models/transaction.model';

/**
 * Generated class for the SuccessfulTransactionModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'successful-transaction-modal',
  templateUrl: 'successful-transaction-modal.html'
})
export class SuccessfulTransactionModalComponent {

  transaction: Transaction;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.transaction = params.get('transaction');
  }

}
