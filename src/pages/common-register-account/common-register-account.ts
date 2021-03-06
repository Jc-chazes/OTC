import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl, Validator, ValidationErrors, FormControl } from '@angular/forms';
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

@Component({
  selector: 'page-common-register-account',
  templateUrl: 'common-register-account.html',
})
export class CommonRegisterAccountPage {

  userType: string;
  profileFG: FormGroup;
  showPassword = false;
  provider: 'GOOGLE' | 'FACEBOOK';
  optionalFieldsForIos = ['cellphone','phone','documentNumber','ruc'];

  get isIos(){
    return this.platform.is('ios');
    // return true;
  }

  requiredByPlatform(fieldName: string){
    return ( c: FormControl ) => {
      if( !c.parent ){
        return null;
      }
      if( !this.isIos ){
        return Validators.required(c);
      }else{
        if( this.optionalFieldsForIos.indexOf(fieldName) >= 0 ){
          return null;
        }else{
          return Validators.required(c);
        }
      }
    }
  }

  isRequiredInPlatform( fieldName ): boolean{
    if( this.isIos ){
      return this.optionalFieldsForIos.indexOf(fieldName) < 0;
    }else{
      return true;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App,
  private fb: FormBuilder, private auth: AuthProvider, public appState: AppStateService,
  private UsersBankAccounts: UsersBankAccountsService, private modals: ModalUtil,
  private modalCtrl: ModalController, private alerts: AlertUtil, private loading: LoadingUtil,
  private platform: Platform) {
    this.userType = this.appState.currentState.global.userType;
    if( this.isPerson ){
      this.profileFG = this.fb.group({
        firstName: [undefined,[ this.byType('0',Validators.required,'firstName') ]],//PERSON
        lastName: [undefined,[ this.byType('0',Validators.required,'lastName') ]],//PERSON
        birthdate: [null,[ this.byType('0',Validators.required,'birthdate'), this.ageValidator ]],//COMMON
        formatBirthdate: [''],//COMMON
        documentNumber: [undefined,[ this.byType('0',this.requiredByPlatform('documentNumber')) ]],//COMMON
        businessName: [undefined,[ this.byType('1',Validators.required) ]],//PERSON
        ruc: [undefined,[ this.byType('1',this.requiredByPlatform('ruc')) ]],//PERSON
        cellphone: [undefined,[ this.requiredByPlatform('cellphone') ]],//PERSON    
        type: ['0',Validators.required],//COMMON
        acceptTermsAndConditions: [false,[]],//COMMON        
        user: this.fb.group({//COMMON
          email: ['',[Validators.email]],
          password: ['', this.navParams.get('email') ? [] : [ Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,12}$/) ]],
          userType: ['0']
        })
      });
      this.profileFG.patchValue({
        user: {
          email: this.navParams.get('email')
        },
        firstName: this.navParams.get('firstName'),
        lastName: this.navParams.get('lastName')
      });
      this.provider = this.navParams.get('provider');
    }
    if( this.isExchangeAgent ){
      this.profileFG = this.fb.group({
        name: [undefined,Validators.required],//EXCHANGE AGENT
        documentNumber: [undefined,this.requiredByPlatform('documentNumber')],//COMMON
        birthdate: [null,[]],//COMMON
        formatBirthdate: ['',[this.byType('1',Validators.required)]],//COMMON
        address: [undefined,Validators.required],//EXCHANGE AGENT
        phone: [undefined,this.requiredByPlatform('phone')],//EXCHANGE AGENT
        sbsRegisterNumber: [undefined, this.byType('0',Validators.required)],//EXCHANGE AGENT
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
    });
    this.profileFG.get('type').valueChanges.subscribe( () => {
      Object.keys( this.profileFG.controls )
      .filter( control => [ 
        'firstName','lastName','birthdate','formatBirthdate','documentNumber'
        ,'businessName','ruc','sbsRegisterNumber' ].indexOf(control) >= 0 )
      .forEach( control => {
        this.profileFG.controls[control].updateValueAndValidity();
      })
    });
  }

  ionViewWillEnter(){}

  ionViewDidLoad() {}

  validatePassword(){
    
    Object.keys( this.profileFG.controls ).forEach( controlName => {
      this.profileFG.controls[controlName].markAsTouched();
    });

    var regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,12}$/;
    var password = this.profileFG.value.user.password;
    var isValid = (regex.test(password));
    
    if ( !!this.provider || isValid)
      this.createAccount();
    else 
      this.alerts.show('Tiene que tener entre 6 y 12 caracteres, una letra mayúscula y un número.', 'Contraseña inválida');
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
      }), this.isPerson && this.profileFG.value.type == '0' ? this.provider : null ).subscribe( couldRegister => {
        this.loading.hide();  
        if( !couldRegister ){
          return ;
        }
        let savedUserBankAccount = this.appState.currentState.register.savedUserBankAccount;
        if( savedUserBankAccount.length > 0 ){
          for(let bankAccount of savedUserBankAccount){
            console.log('bank account to create => ', bankAccount);
            this.UsersBankAccounts.add( bankAccount as UserBankAccount )
              .subscribe( results => {});
          }
        }
        this.modals.openModal(this.modalCtrl,AvailableModals.SuccessfulSignUpModal)
          .then( () => {});
        this.app.getRootNav().setRoot(tabs);
      });
    }
    if( this.isExchangeAgent ){
      this.auth.registerExchangeAgent( new ExchangeAgent({
        ...omit(this.profileFG.value,['acceptTermsAndConditions','formatBirthdate'])
      }) ).subscribe( couldRegister => {
        this.loading.hide()
        .then(()=>{
          if( !couldRegister ){
            if( couldRegister === undefined ){
              // this.profileFG.reset();
            }
            this.navCtrl.pop();
            return ;
          }
          let savedUserBankAccount = this.appState.currentState.register.savedUserBankAccount;
          if( savedUserBankAccount.length > 0 ){
            for(let bankAccount of savedUserBankAccount){
              this.UsersBankAccounts.add( bankAccount as UserBankAccount )
                .subscribe( results => {});
            }
          }
          this.modals.openModal(this.modalCtrl,AvailableModals.SuccessfulSignUpModal)
            .then( () => {});
          this.app.getRootNav().setRoot(tabs);

        });
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

  byType( isType: string, validator: Validator | ValidationErrors, name?: string, subtype?: number ){
    return (c:AbstractControl) => {
      let result = null;
      if( !!c.parent && c.parent.get('type').value == isType ){
        if( typeof(validator) == 'function' ){
          result =  validator(c);
        }
        // console.log(`${c.parent.get('type').value} - ${isType}`);
      }
      // console.log(`el control ${name} es ${JSON.stringify(result)}`);
      return result;
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

  isInvalid(control: string | AbstractControl){
    let insControl = control instanceof AbstractControl ? control : this.profileFG.controls[control] ;
    return insControl.invalid && insControl.touched;
  }

  onBirthdateDatepickerCancel(){
    this.profileFG.get('formatBirthdate').markAsTouched();
  }

}
