import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { MyBankAccountsSpecification } from '../../providers/specifications/user-bank-account.specification';
import { CommonMyBankAccountsAddPage } from '../common-my-bank-accounts-add/common-my-bank-accounts-add';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { DomSanitizer } from '@angular/platform-browser';
import { getImageUrl } from '../../helpers/images.helper';

/**
 * Generated class for the CommonMyBankAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-my-bank-accounts',
  templateUrl: 'common-my-bank-accounts.html',
})
export class CommonMyBankAccountsPage {

  bankAccountList: UserBankAccount[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
    private userBankAccounts: UsersBankAccountsService, private loading: LoadingUtil) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyBankAccountsPage');
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh(){
    this.userBankAccounts.find( new MyBankAccountsSpecification() )
    .subscribe( results => {
      this.bankAccountList = results;
    });
  }

  goToAddBankAccount(){
    this.navCtrl.push(CommonMyBankAccountsAddPage);
  }

  activeBankAccount( bankAccount: UserBankAccount ){
    this.loading.show();
    this.userBankAccounts.activateBankAccount( bankAccount )
    .subscribe( resp => {
      this.refresh();
      this.loading.hide();
    })
  }

  deleteBankAccount(bankAccount: UserBankAccount){
    this.loading.show();
    this.userBankAccounts.remove( bankAccount )
    .subscribe( resp => {
      this.refresh();
      this.loading.hide();
    })
  }

  getBackgroundImage(bankAccount: UserBankAccount){
    if( !bankAccount.bank.image ){
      return null;
    }
    return this.sanitizer.bypassSecurityTrustUrl(bankAccount.bank.image.fileUrl);
  }

}
