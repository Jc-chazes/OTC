import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertUtil } from '../../providers/utils/alert.util';
import { AuthProvider } from '../../providers/auth.service';
import { LoadingUtil } from '../../providers/utils/loading.util';

/**
 * Generated class for the RequestResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-reset-password',
  templateUrl: 'request-reset-password.html',
})
export class RequestResetPasswordPage {

  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
  private alerts: AlertUtil, private auth: AuthProvider, private loading: LoadingUtil) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestResetPasswordPage');
  }

  submit(){
    if( this.email ){
      this.loading.show();
      this.auth.sendResetPasswordEmail(this.email)
      .subscribe( couldResetPassword => {
        this.loading.hide();
        if( !couldResetPassword ){
          this.alerts.show('El correo de recuperación no ha podido ser enviado, intente de nuevo más tarde','Cambio de contraseña');
        }else{
          this.alerts.show('El correo de recuperación ha sido enviado','Recuperar contraseña');
          this.navCtrl.pop();
        }
      });
    }else{
      this.alerts.show('No es un correo válido','Recuperar contraseña');
    }
  }

}
