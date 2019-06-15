import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../providers/users.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertUtil } from '../../providers/utils/alert.util';
import { QuotePage } from '../quote/quote';
import { ExchangeAgentMyOfferingsPage } from '../exchange-agent-my-offerings/exchange-agent-my-offerings';
import { AuthProvider } from '../../providers/auth.service';
import { LoadingUtil } from '../../providers/utils/loading.util';

/**
 * Generated class for the CommonCompleteProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-complete-profile',
  templateUrl: 'common-complete-profile.html',
})
export class CommonCompleteProfilePage {

  missingFields: string[];
  missingFieldsFG: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService,
    private fb: FormBuilder, private alerts: AlertUtil, private auth: AuthProvider, private loading: LoadingUtil) {
    this.missingFields = this.users.missingCurrenUserInfoFields();
    let missignFieldsObj = this.missingFields.reduce( (obj,missingField) => {
      obj[missingField] = [ null, [Validators.required] ];
      return obj;
    },{});
    this.missingFieldsFG = this.fb.group( missignFieldsObj );
  }

  getInputType(missingFieldName: string): string{
    let forTypeNumber = ['phone','cellphone'];
    if( forTypeNumber.indexOf(missingFieldName) >= 0 ){
      return 'number';
    }
    return 'text';
  }

  getFielLabel(missingFieldName: string): string{
    if( this.users.currentUser.isPerson() ){
      if( this.users.currentUser.person.type === '0' ){
          if( missingFieldName === 'documentNumber' ){
            return 'Dni / Carné de extranjería';
          }
      }else{
          if( missingFieldName === 'ruc' ){
            return 'Ruc';
          }
      }
      if( missingFieldName === 'cellphone' ){
          return 'Celular';
      }
    }else{
        if( this.users.currentUser.exchangeAgent.type === '0' ){
  
        }else{
            
        }
        if( missingFieldName === 'documentNumber' ){
          return 'Dni / Ruc';
        }
        if( missingFieldName === 'phone' ){
          return 'Teléfono / celular';
        }
    }
  }

  ionViewDidLoad() {

  }

  isInvalid(control: string | AbstractControl){
    let insControl = control instanceof AbstractControl ? control : this.missingFieldsFG.controls[control] ;
    return insControl.invalid && insControl.touched;
  }
  

  submit(){
    if( this.missingFieldsFG.invalid ){
      this.alerts.show('Faltan completar datos requeridos','Información complementaria');
      Object.keys( this.missingFieldsFG.controls )
      .map( key => this.missingFieldsFG.get(key) )
      .forEach( c => {
        c.markAsTouched();
      });
      return;
    }
    this.loading.show();
    this.users.updateMissingFields( this.missingFieldsFG.value )
    .subscribe( result => {
      if( result ){
        this.loading.hide();
        this.alerts.show('Sus datos fueron actualizados correctamente','Información complementaria')
        .then( () => {
          this.loading.show();
          this.auth.populate()
          .subscribe( () => {
            this.loading.hide();
            if( this.users.currentUser.isPerson() ){
              this.navCtrl.setRoot(QuotePage);
            }else{
              this.navCtrl.setRoot(ExchangeAgentMyOfferingsPage);
            }
          });          
        });
      }else{
        this.loading.hide();
        this.alerts.show('No se pudo actualizar sus datos, inténtelo de nuevo.','Información complementaria');
      }
    })
  }

}
