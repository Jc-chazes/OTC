import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ExchangeAgentOfferingsService } from '../../providers/exchange-agent-offerings.service';
import { ExchangeAgentOffering } from '../../models/exchange-agent-offering.model';
import { Currency } from '../../models/currency.model';
import { ExchangeAgentOfferingGroup } from '../../models/exchang-agent-offering-group.model';
import { TransactionsService } from '../../providers/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { MyPendingTransactions } from '../../providers/specifications/transaction.specification';

/**
 * Generated class for the ExchangeAgentMyRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-my-requests',
  templateUrl: 'exchange-agent-my-requests.html',
})
export class ExchangeAgentMyRequestsPage {

  groupedExchangeList: ExchangeAgentOfferingGroup[];
  pendingTransactionList: Transaction[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private exchangeAgentOfferings: ExchangeAgentOfferingsService, private transactions: TransactionsService) {
    this.exchangeAgentOfferings.getGroupedExchangeAgentOfferings()
    .subscribe( results => {
      this.groupedExchangeList = results;
    });
    this.transactions.find( new MyPendingTransactions() )
    .subscribe( results => {
      this.pendingTransactionList = results;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentMyRequestsPage');
  }

}
