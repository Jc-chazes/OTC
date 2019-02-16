import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { AlertUtil } from '../../providers/utils/alert.util';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { Bank } from '../../models/bank.model';

/**
 * Generated class for the CommonMyBankAccountsAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-my-bank-accounts-add',
  templateUrl: 'common-my-bank-accounts-add.html',
})
export class CommonMyBankAccountsAddPage {

  userBankAccountFG: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
    private userBankAccounts: UsersBankAccountsService, private alerts: AlertUtil, private loading: LoadingUtil) {
    this.userBankAccountFG = this.fb.group({
      holderName: ['',[Validators.required]],
      accountNumber: ['',[Validators.required]],
      apellative: ['',[Validators.required]],
      currency: [null,[Validators.required]],
      bank: [null,[Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyBankAccountsAddPage');
  }

  submit(){
    if( this.userBankAccountFG.valid ){
      const { bank, accountNumber } = this.userBankAccountFG.value;
      // if( accountNumber.length != (bank as Bank).accountNumberLength ){
      //   this.alerts.show(`El número de cuenta bancaria ingresado no cumple con los requisitos del banco: ${(bank as Bank).accountNumberLength} dígitos`,
      //   'Cuentas bancarias');
      //   return;
      // }
      this.loading.show();
      let toCreateBankAccount = this.userBankAccountFG.value as UserBankAccount;
      this.userBankAccounts.add( toCreateBankAccount )
      .subscribe( results => {
        this.loading.hide();
        if( results ){
          this.alerts.show('Cuenta creada exitosamente','Cuentas bancarias');
          this.navCtrl.pop();
        }
      })
    }else{
      this.alerts.show('Faltan llenar campos','Cuentas bancarias');
    }
  }

}
