import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { MyBankAccountsSpecification } from '../../providers/specifications/user-bank-account.specification';
import { CommonMyBankAccountsAddPage } from '../common-my-bank-accounts-add/common-my-bank-accounts-add';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private userBankAccounts: UsersBankAccountsService) {
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

}
