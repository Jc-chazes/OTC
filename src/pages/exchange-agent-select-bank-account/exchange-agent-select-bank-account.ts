import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { MyBankAccountsSpecification } from '../../providers/specifications/user-bank-account.specification';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { BanksService } from '../../providers/banks.service';
import { Bank } from '../../models/bank.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';

/**
 * Generated class for the ExchangeAgentSelectBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-select-bank-account',
  templateUrl: 'exchange-agent-select-bank-account.html',
})
export class ExchangeAgentSelectBankAccountPage {

  mode: 'NEW' | 'SELECT' = 'NEW';
  userBankAccountList: UserBankAccount[] = [];
  selectedUserBankAccountList: UserBankAccount;
  bankList: Bank[];
  currentBankIndex = 0;
  userBankAccountFG: FormGroup;
  transaction: Transaction;
  acceptTermsAndConditions = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userBankAccounts: UsersBankAccountsService, private loading: LoadingUtil,
    private banks: BanksService, private fb: FormBuilder) {
    this.transaction = this.navParams.get('transaction');
    this.banks.find().subscribe( results => {
      this.bankList = results;
    });
    this.userBankAccountFG = this.fb.group({
      holderName: ['',[Validators.required]],
      accountNumber: ['',[Validators.required]],
      apellative: ['',[Validators.required]],
      currency: [null,[Validators.required]],
      bank: [null,[Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentSelectBankAccountPage');
  }

  ionViewWillEnter(){
    this.loading.show();
    this.userBankAccounts.find( new MyBankAccountsSpecification() )
    .subscribe( results => {
      this.userBankAccountList = results;
      if( this.userBankAccountList.length <= 0 ){
        this.mode = 'NEW';
      }else{
        this.mode = 'SELECT'
        this.selectedUserBankAccountList = this.userBankAccountList[0];
      }
      this.loading.hide();
    })    
  }

  onPreviousBank(){
    if( this.currentBankIndex == 0 ){
      this.currentBankIndex = this.bankList.length - 1;
    }else {
      this.currentBankIndex--;
    }
    this.userBankAccountFG.patchValue({
      bank: this.bankList[this.currentBankIndex]
    });
  }

  onNextBank(){
    if( this.currentBankIndex == this.bankList.length - 1 ){
      this.currentBankIndex = 0;
    }else {
      this.currentBankIndex++;
    }
    this.userBankAccountFG.patchValue({
      bank: this.bankList[this.currentBankIndex]
    });
  }

  save(){
    if( this.mode == 'NEW' ){
      if( this.userBankAccountFG.valid ){
        this.userBankAccounts.add( this.userBankAccountFG.value )
        .subscribe( results => {
          if( results ){
            this.goToOTCBankAccounts();
          }
        })
      }
    }else{
      this.goToOTCBankAccounts();
    }
  }

  goToOTCBankAccounts(){

  }

}
