import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TransactionsService } from '../../providers/transaction.service';
import { Transaction } from '../../models/transaction.model';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingUtil } from '../../providers/utils/loading.util';

/**
 * Generated class for the CommonMyTransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-my-transactions',
  templateUrl: 'common-my-transactions.html',
})
export class CommonMyTransactionsPage {

  transactionsPerMonth: { month: string, transactions: Transaction[] }[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private transactions: TransactionsService,
    private sanitizer: DomSanitizer, private loading: LoadingUtil) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyTransactionsPage');
  }

  ionViewWillEnter(){
    this.loading.show();
    this.transactions.find()
    .subscribe( results => {
      this.transactionsPerMonth = this.transactions.groupByMonth(results).map( group => ({
        month: `${moment.months()[group.period.month-1]} - ${group.period.year}`,
        transactions: group.transactions
      }))
      this.loading.hide();
    })
  }

  getAvatarUrl(transaction: Transaction){
    if( transaction.person.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${transaction.person.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }

}
