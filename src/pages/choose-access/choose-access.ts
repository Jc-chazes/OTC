import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Login } from '../login/login';
import { AppStateService } from '../../providers/app-state.service';
import { CommonRegisterAccountPage } from '../common-register-account/common-register-account';
import { AuthProvider } from '../../providers/auth.service';
import { UsersService } from '../../providers/users.service';
import { PersonTabsPage } from '../person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../exchange-agent-tabs/exchange-agent-tabs';
import { User } from '../../models/user.model';
import { AlertUtil } from '../../providers/utils/alert.util';
import { RequestResetPasswordPage } from '../request-reset-password/request-reset-password';
import { LoadingUtil } from '../../providers/utils/loading.util';

@Component({
  selector: 'page-choose-access',
  templateUrl: 'choose-access.html',
})
export class ChooseAccessPage {

  user = new User();
  showPassword = false;

  constructor(public nvCtrl : NavController, 
              public appState: AppStateService, 
              private auth: AuthProvider,
              private users: UsersService,
              private loadingCtrl: LoadingController,
              private loading: LoadingUtil,
              private alerts : AlertUtil,
              private app: App) 
              {
                this.user.userType = this.appState.currentState.global.userType;
              }

  ngOnInit() {}

  /* login(){
    this.nvCtrl.push(Login)
  } */
  ionViewWillEnter(){
    this.auth.logout();
  }

  loginWithGoogle(){
    this.auth.loginWithGoogle(this.loading)
    .subscribe( result => {
      this.loading.hide();
      if( result.canceled ){
        return ;
      }
      if( result.couldLogin ){
        let tabs = null;
        if( this.users.currentUser.userType == '0' ){
          tabs = PersonTabsPage;
        }else {
          tabs = ExchangeAgentTabsPage;
        }
        this.app.getRootNav().setRoot(tabs);
      }else{
        if( !!result.email ){
          this.nvCtrl.push( CommonRegisterAccountPage, {
            ...result,
            provider: 'GOOGLE'
          } );
        }
      }
    });
  }

  loginWithFacebook(){
    this.auth.loginWithFacebook(this.loading)
    .subscribe( result => {
      this.loading.hide();
      if( result.canceled ){
        return ;
      }
      if( result.couldLogin ){
        let tabs = null;
        if( this.users.currentUser.userType == '0' ){
          tabs = PersonTabsPage;
        }else {
          tabs = ExchangeAgentTabsPage;
        }
        this.app.getRootNav().setRoot(tabs);
      }else{
        if( !!result.email ){
          this.nvCtrl.push( CommonRegisterAccountPage, {
            ...result,
            provider: 'FACEBOOK'
          } );
        }
      }
    });
  }

  login(){
    if( this.user.password && this.user.email ){
      let loading = this.loadingCtrl.create();
      loading.present();
      this.auth.login(this.user).subscribe( results => {
        loading.dismiss();
        if(results){
          let tabs = null;
          if( this.users.currentUser.userType == '0' ){
            tabs = PersonTabsPage;
          }else {
            tabs = ExchangeAgentTabsPage;
          }
          this.app.getRootNav().setRoot(tabs);
        }else{
          // this.alerts.show('Credenciales inválidas','Login');
        }
      })
    }
  }

  forgotPassword($event: any){
    $event.preventDefault();
    this.nvCtrl.push(RequestResetPasswordPage);
  }

  registerUser(){
    if( this.appState.currentState.global.userType == '0' ){
      this.nvCtrl.push(CommonRegisterAccountPage)
    }else{
      this.nvCtrl.push(CommonRegisterAccountPage)
    }
  }

}
