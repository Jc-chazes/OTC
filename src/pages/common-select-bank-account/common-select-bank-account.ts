import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { Bank } from '../../models/bank.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { BanksService } from '../../providers/banks.service';
import { MyBankAccountsSpecification } from '../../providers/specifications/user-bank-account.specification';
import { CommonTransferToOtcPage } from '../common-transfer-to-otc/common-transfer-to-otc';
import { TransactionsService } from '../../providers/transaction.service';
import { AlertUtil } from '../../providers/utils/alert.util';
import { UsersService } from '../../providers/users.service';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';

/**
 * Generated class for the CommonSelectBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-select-bank-account',
  templateUrl: 'common-select-bank-account.html',
})
export class CommonSelectBankAccountPage {

  mode: 'NEW' | 'SELECT' = 'NEW';
  userBankAccountList: UserBankAccount[] = [];
  selectedUserBankAccount: UserBankAccount;
  bankList: Bank[];
  currentBankIndex = 0;
  userBankAccountFG: FormGroup;
  transaction: Transaction;
  acceptTermsAndConditions = false;
  canContinue = false;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private alerts: AlertUtil,
    private userBankAccounts: UsersBankAccountsService, private loading: LoadingUtil, public users: UsersService,
    private banks: BanksService, private fb: FormBuilder, private transactions: TransactionsService,
    private modalCtrl: ModalController, private modals: ModalUtil) {
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
    console.log('ionViewDidLoad CommonSelectBankAccountPage');
  }

  ionViewCanLeave(){
    if( this.canContinue ){
      return true;
    }
    if( 
      ( this.users.currentUser.isPerson() && !!this.users.currentUser.person.currentTransaction ) ||      
      ( this.users.currentUser.isExchangeAgent() && !!this.users.currentUser.exchangeAgent.currentTransaction
      && this.users.currentUser.exchangeAgent.currentTransaction.type == 'FAST' ) 
    ){
      this.alerts.show('Tienes una transacción en curso',"OTC");
      return false;
    }
    // let canLeave = false;
    // if( this.users.currentUser.isPerson() ){
    //   canLeave = !this.users.currentUser.person.currentTransaction;
    // }else{
    //   canLeave = !this.users.currentUser.exchangeAgent.currentTransaction ;
    // }
    // if( !canLeave ){
    //   this.alerts.show('Tienes una transacción en curso',"OTC");
    // }
    // return canLeave;
  }

  ionViewWillEnter(){
    this.loading.show();
    this.userBankAccounts.find( new MyBankAccountsSpecification() )
    .subscribe( results => {
      if( this.users.currentUser.userType == '0' ){
        this.userBankAccountList = results.filter( r => r.currency.code == this.transaction.exchangeAgentOffering.requestedCurrency );
      }else{
        this.userBankAccountList = results.filter( r => r.currency.code == this.transaction.exchangeAgentOffering.receivedCurrency );
      }
      if( this.userBankAccountList.length <= 0 ){
        this.mode = 'NEW';
      }else{
        this.mode = 'SELECT'
        this.selectedUserBankAccount = this.userBankAccountList[0];
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
    if( !this.acceptTermsAndConditions ){
      this.alerts.show('Debe aceptar los términos y condiciones','Cuentas bancarias');
      return;
    }
    if( this.mode == 'NEW' ){
      if( this.userBankAccountFG.valid ){
        let toCreateBankAccount = this.userBankAccountFG.value as UserBankAccount;
        if( ( this.users.currentUser.userType == '0' && toCreateBankAccount.currency.code != this.transaction.exchangeAgentOffering.requestedCurrency )
         || ( this.users.currentUser.userType == '1' && toCreateBankAccount.currency.code != this.transaction.exchangeAgentOffering.receivedCurrency ) ){
          this.alerts.show('Moneda no válida para la transacción en curso','Cuentas bancarias');
          return;
        }
        this.userBankAccounts.add( toCreateBankAccount )
        .subscribe( results => {
          if( results ){
            this.goToOTCBankAccounts( results );
          }
        })
      }else{
        this.alerts.show('Faltan llenar campos','Cuentas bancarias');
      }
    }else{
      this.goToOTCBankAccounts( this.selectedUserBankAccount );
    }
  }

  goToOTCBankAccounts( selectedUserBankAccount: UserBankAccount ){
    this.loading.show();
    this.transactions.setTransactionBankAccount( selectedUserBankAccount, this.transaction )
    .subscribe( results => {
      this.loading.hide();
      if( results ){
        this.canContinue = true;
        this.navCtrl.push( CommonTransferToOtcPage, {
          transaction: this.transaction
        });
      }
    })
  }
  
  openTermsAndConditions(event){
    event.preventDefault();
    this.modals.openModal(this.modalCtrl,AvailableModals.TermsAndConditions)
    .then( () => {
      this.acceptTermsAndConditions = true;
    });
  }

  onCancel(){
    this.navCtrl.popToRoot();    
  }

}
