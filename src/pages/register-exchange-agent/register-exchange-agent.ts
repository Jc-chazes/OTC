import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isString, omit } from 'lodash';
import { AuthProvider } from '../../providers/auth.service';
import { RegisterBankAccountPage } from '../register-bank-account/register-bank-account';
import { AppStateService } from '../../providers/app-state.service';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { UserBankAccount } from '../../models/user-bank-account.model';

/**
 * Generated class for the RegisterExchangeAgentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register-exchange-agent',
  templateUrl: 'register-exchange-agent.html',
})
export class RegisterExchangeAgentPage {

  exchangeAgentFG: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private fb: FormBuilder, private auth: AuthProvider, private appState: AppStateService,
  private UsersBankAccounts: UsersBankAccountsService) {
    this.exchangeAgentFG = this.fb.group({
      name: [undefined,Validators.required],
      documentNumber: [undefined,Validators.required],
      birthdate: [null,[]],
      formatBirthdate: [''],
      address: [undefined,Validators.required],
      phone: [undefined,Validators.required],
      sbsRegisterNumber: [undefined,Validators.required],
      type: ['0',Validators.required],
      acceptTermsAndConditions: [false,[]],
      user: this.fb.group({
        email: ['',[Validators.email]],
        password: ['',[Validators.required]],
        userType: ['1']
      })
    });
    this.exchangeAgentFG.get('birthdate').valueChanges.subscribe( (birthdate: string) => {
      if( !!birthdate && isString(birthdate) ){
        let formatBirthdate = birthdate.split('-').reverse().join('-');
        this.exchangeAgentFG.patchValue({
          formatBirthdate
        });
      }
    })
  }

  ionViewDidLoad() {
    
  }

  createAccount(){
    if( !this.exchangeAgentFG.value.acceptTermsAndConditions ){
      console.warn('Términos no aceptados');
      return;
    }
    if( !this.exchangeAgentFG.valid ){
      console.warn('Formulario inválido');
      return;
    }
    this.auth.registerExchangeAgent( new ExchangeAgent({
      ...omit(this.exchangeAgentFG.value,['acceptTermsAndConditions','formatBirthdate'])
    }) ).subscribe( results => {
      let savedUserBankAccount = this.appState.currentState.register.savedUserBankAccount;
      if( savedUserBankAccount ){
        this.UsersBankAccounts.add( savedUserBankAccount as UserBankAccount )
        .subscribe( results => {

        });
      }
    });
  }

  onAddBankAccount(){
    this.navCtrl.push( RegisterBankAccountPage )
  }
}
