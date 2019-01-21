import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertUtil } from '../../providers/utils/alert.util';
import { AuthProvider } from '../../providers/auth.service';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  resetPasswordFG: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  token = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
  private alerts: AlertUtil, private auth: AuthProvider) {
    this.token = navParams.get('token');
    this.resetPasswordFG = fb.group({
      password: ['',[Validators.required]],
      confirmPassword: ['',[Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  submit(){
    if( this.resetPasswordFG.valid ){
      if( this.resetPasswordFG.value.password != this.resetPasswordFG.value.confirmPassword ){
        this.alerts.show('Las constraseñas son diferentes','Cambio de contraseña');
      }else{
        this.auth.resetPassword(this.resetPasswordFG.value.password,this.token)
        .subscribe( couldResetPassword => {
          if( !couldResetPassword ){
            this.alerts.show('Su contraseña no ha podido se cambiada, inténtelo más tarde','Cambio de contraseña');
          }else{
            this.alerts.show('Su contraseña ha sido cambiada con éxito','Cambio de contraseña');
            this.navCtrl.pop();
          }
        });
      }
    }
  }

}
