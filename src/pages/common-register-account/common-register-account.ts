import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl, Validator, ValidationErrors } from '@angular/forms';
import { AuthProvider } from '../../providers/auth.service';
import { AppStateService } from '../../providers/app-state.service';
import { UsersBankAccountsService } from '../../providers/users-bank-accounts.service';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { UserBankAccount } from '../../models/user-bank-account.model';
import { RegisterBankAccountPage } from '../register-bank-account/register-bank-account';
import { isString, omit } from 'lodash';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { Person } from '../../models/person.model';
import { AlertUtil } from '../../providers/utils/alert.util';
import { PersonTabsPage } from '../person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../exchange-agent-tabs/exchange-agent-tabs';
import { LoadingUtil } from '../../providers/utils/loading.util';
import moment from 'moment';

/**
 * Generated class for the CommonRegisterAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-register-account',
  templateUrl: 'common-register-account.html',
})
export class CommonRegisterAccountPage {

  userType: string;
  profileFG: FormGroup;
  showPassword = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App,
  private fb: FormBuilder, private auth: AuthProvider, private appState: AppStateService,
  private UsersBankAccounts: UsersBankAccountsService, private modals: ModalUtil,
  private modalCtrl: ModalController, private alerts: AlertUtil, private loading: LoadingUtil) {
    this.userType = this.appState.currentState.global.userType;
    if( this.isPerson ){
      this.profileFG = this.fb.group({
        firstName: [undefined,[ this.byType('0',Validators.required) ]],//PERSON
        lastName: [undefined,[ this.byType('0',Validators.required) ]],//PERSON
        birthdate: [null,[ this.byType('0',Validators.required), this.ageValidator ]],//COMMON
        formatBirthdate: [''],//COMMON
        documentNumber: [undefined,[ this.byType('0',Validators.required) ]],//COMMON
        businessName: [undefined,[ this.byType('1',Validators.required) ]],//PERSON
        ruc: [undefined,[ this.byType('1',Validators.required) ]],//PERSON
        cellphone: [undefined,[Validators.required]],//PERSON    
        type: ['0',Validators.required],//COMMON
        acceptTermsAndConditions: [false,[]],//COMMON        
        user: this.fb.group({//COMMON
          email: ['',[Validators.email]],
          password: ['',[Validators.required]],
          userType: ['0']
        })
      });
    }
    if( this.isExchangeAgent ){
      this.profileFG = this.fb.group({
        name: [undefined,Validators.required],//EXCHANGE AGENT
        documentNumber: [undefined,Validators.required],//COMMON
        birthdate: [null,[]],//COMMON
        formatBirthdate: [''],//COMMON
        address: [undefined,Validators.required],//EXCHANGE AGENT
        phone: [undefined,Validators.required],//EXCHANGE AGENT
        sbsRegisterNumber: [undefined,Validators.required],//EXCHANGE AGENT
        type: ['0',Validators.required],//COMMON
        acceptTermsAndConditions: [false,[]],//COMMON
        user: this.fb.group({//COMMON
          email: ['',[Validators.email]],
          password: ['',[Validators.required]],
          userType: ['1']
        })
      });
    }
    this.profileFG.get('birthdate').valueChanges.subscribe( (birthdate: string) => {
      if( !!birthdate && isString(birthdate) ){
        let formatBirthdate = birthdate.split('-').reverse().join('-');
        this.profileFG.patchValue({
          formatBirthdate
        });
      }
    })
  }

  ionViewDidLoad() {
    
  }

  createAccount(){
    let tabs = null;
    if( this.userType == '0' ){
      tabs = PersonTabsPage;
    }else {
      tabs = ExchangeAgentTabsPage;
    }
    if( !this.profileFG.value.acceptTermsAndConditions ){
      this.alerts.show('Términos y condiciones no aceptados','Registro')
      return;
    }
    
    if( !this.profileFG.valid ){
      if( this.profileFG.get('birthdate').hasError('age') ){
        this.alerts.show('Tienes que ser mayor de edad para registrarte','Registro');
      }else{
        this.alerts.show('Falta completar campos','Registro');
      }
      return;
    }
    this.loading.show();
    if( this.isPerson ){
      this.auth.registerPerson( new Person({
        ...omit(this.profileFG.value,['acceptTermsAndConditions','formatBirthdate'])
      }) ).subscribe( results => {
        this.loading.hide();  
        let savedUserBankAccount = this.appState.currentState.register.savedUserBankAccount;
        if( savedUserBankAccount ){
          this.UsersBankAccounts.add( savedUserBankAccount as UserBankAccount )
          .subscribe( results => {
          });
        }
        this.alerts.show('Registro exitoso','Registro');
        this.app.getRootNav().setRoot(tabs);
      });
    }
    if( this.isExchangeAgent ){
      this.auth.registerExchangeAgent( new ExchangeAgent({
        ...omit(this.profileFG.value,['acceptTermsAndConditions','formatBirthdate'])
      }) ).subscribe( results => {
        this.loading.hide();  
        let savedUserBankAccount = this.appState.currentState.register.savedUserBankAccount;
        if( savedUserBankAccount ){
          this.UsersBankAccounts.add( savedUserBankAccount as UserBankAccount )
          .subscribe( results => {
            this.loading.hide();  
          });
        }
        this.alerts.show('Registro exitoso','Registro');
        this.app.getRootNav().setRoot(tabs);
      });
    }
  }

  onAddBankAccount(){
    this.navCtrl.push( RegisterBankAccountPage )
  }
  
  openTermsAndConditions(event){
    event.preventDefault();
    this.modals.openModal(this.modalCtrl,AvailableModals.TermsAndConditions)
    .then( (check) => {
      if( check ){
        this.profileFG.patchValue({
          acceptTermsAndConditions: true
        });
      }
    });
  }
  
  get isPerson() { return this.userType == '0' }
  get isExchangeAgent() { return this.userType == '1' }

  byType( isType: string, validator: Validator | ValidationErrors ){
    return (c:AbstractControl) => {
      if( !c.parent ) return true;
      if( c.parent.get('type').value == isType ){
        if( typeof(validator) == 'function' ){
          return validator(c);
        }else{
          return null;
        }
      }else{
        return null;
      }
    }
  }

  ageValidator(c: AbstractControl){
    var age = moment(moment()).diff(c.value,'years');
    if( !!c.value && age < 18 ){
      return { 
        age: true
      }
    }
    return null;
  }

}
