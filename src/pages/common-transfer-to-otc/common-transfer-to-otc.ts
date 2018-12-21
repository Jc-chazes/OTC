import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Transaction } from '../../models/transaction.model';
import { Constant } from '../../models/constant.model';
import { ConstantsService } from '../../providers/constants.service';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';
import { UsersService } from '../../providers/users.service';
import { Observable } from 'rxjs';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { OtcBankAccountsSpecification } from '../../providers/specifications/user-bank-account.specification';
import { CommonSendVoucherPage } from '../common-send-voucher/common-send-voucher';

/**
 * Generated class for the CommonTransferToOtcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-transfer-to-otc',
  templateUrl: 'common-transfer-to-otc.html',
})
export class CommonTransferToOtcPage {
  
  transaction: Transaction;
  otcComission: Constant = new Constant({ content: 0 });
  otcRuc: Constant = new Constant();
  otcBusinessName: Constant = new Constant();
  otcBankAccountList: UserBankAccount[];
  selectedOtcBankAccount: UserBankAccount;

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService,
    private constants: ConstantsService, private userBankAccounts : UsersBankAccountsService ) {
    this.transaction = this.navParams.get('transaction');
    Observable.forkJoin(
      this.constants.findOne( new ConstantByCodeSpecification(
        `OTC_COMISSION_${this.transaction.exchangeAgentOffering[ this.users.currentUser.userType == '0' ? 'receivedCurrency' : 'requestedCurrency' ]}`)
      ),
      this.constants.findOne( new ConstantByCodeSpecification(`OTC_RUC`)),
      this.constants.findOne( new ConstantByCodeSpecification(`OTC_BUSINESS_NAME`)),
      this.userBankAccounts.find( new OtcBankAccountsSpecification() )
    )    
    .subscribe( results => {
      this.otcComission = results[0];
      this.otcComission.content = Number(this.otcComission.content);
      this.otcRuc = results[1];
      this.otcBusinessName = results[2];
      if( this.users.currentUser.isPerson() ){
        this.otcBankAccountList = results[3].filter( ba => ba.currency.code == this.transaction.exchangeAgentOffering.receivedCurrency );;
      }else{
        this.otcBankAccountList = results[3].filter( ba => ba.currency.code == this.transaction.exchangeAgentOffering.requestedCurrency );;
      }
      this.selectedOtcBankAccount = this.otcBankAccountList[0];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTransferToOtcPage');
  }

  continue(){
    this.navCtrl.push( CommonSendVoucherPage, {
      transaction: this.transaction
    });
  }

}
