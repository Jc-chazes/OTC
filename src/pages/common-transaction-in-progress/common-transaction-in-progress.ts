import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TransactionsService } from '../../providers/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { UsersService } from '../../providers/users.service';
import { componentDestroyed } from '../../helpers/observable.helper';
import { QuotePage } from '../quote/quote';
import { ExchangeAgentMyOfferingsPage } from '../exchange-agent-my-offerings/exchange-agent-my-offerings';
import { ByIdSpecification } from '../../providers/specifications/base.specification';

/**
 * Generated class for the CommonTransactionInProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-transaction-in-progress',
  templateUrl: 'common-transaction-in-progress.html',
})
export class CommonTransactionInProgressPage implements OnDestroy {

  transaction: Transaction

  constructor(public navCtrl: NavController, public navParams: NavParams, private transactions: TransactionsService,
    private users: UsersService) {
    this.transaction = this.users.currentUser.currentTransaction;
    this.transactions.transactionChange(this.transaction)
    .takeUntil( componentDestroyed(this) )
    .flatMap( tx => this.transactions.findOne(new ByIdSpecification(tx.id))  )
    .subscribe( tx => {
      if( tx ){
        // if( tx.status == '3' ){
        //   if( this.users.currentUser.isPerson() ){
        //     this.transactions.setTransactionTabRoot('QUOTE');
        //   }else{
        //     this.transactions.setTransactionTabRoot('OFFERINGS');
        //   }
        // }
        // if( tx.status == '0' || tx.status == '1' ){
        //   if( this.users.currentUser.isPerson() ){
        //     this.transactions.setTransactionTabRoot('QUOTE');
        //   }else{
        //     this.transactions.setTransactionTabRoot('OFFERINGS');
        //   }
        // }
        let userUploadedVoucher = false;
        let userSelectBankAccount = false;
        if( this.users.currentUser.isPerson() && !!tx.userTransactionImage ){
          userUploadedVoucher = true;
        }
        if( this.users.currentUser.isPerson() && !!tx.personBankAccount ){
          userSelectBankAccount = true;
        }
        if( this.users.currentUser.isExchangeAgent() && !!tx.exchangeAgentTransactionImage ){
          userUploadedVoucher = true;
        }
        if( this.users.currentUser.isExchangeAgent() && !!tx.exchangeAgentBankAccount ){
          userSelectBankAccount = true;
        }
        if( ['0','1'].indexOf(tx.status) >= 0 || ( tx.status == '3' && ( !userUploadedVoucher || !userSelectBankAccount ) ) ){
          if(  ['0','1'].indexOf(tx.status) >= 0 ){
            this.transactions.clearCurrentTransaction();
            this.goToStartByRole()
          }else{
            this.transactions.setCurrentTransaction( this.transaction )
            .subscribe( () => {
              this.goToStartByRole()
            });
          }
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTransactionInProgressPage');
  }

  onCancel(){
    this.goToStartByRole()
  }

  goToStartByRole(){
    if( this.users.currentUser.isPerson() ){
      this.transactions.setTransactionTabRoot('QUOTE');
      this.navCtrl.setRoot( QuotePage );
    }else{
      this.transactions.setTransactionTabRoot('OFFERINGS');
      this.navCtrl.setRoot( ExchangeAgentMyOfferingsPage );
    }
    this.navCtrl.popToRoot();
  }

  ngOnDestroy(){

  }

}
