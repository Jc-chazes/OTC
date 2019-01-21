import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Login } from '../login/login';
import { AppStateService } from '../../providers/app-state.service';
import { CommonRegisterAccountPage } from '../common-register-account/common-register-account';
import { AuthProvider } from '../../providers/auth.service';
import { UsersService } from '../../providers/users.service';
import { PersonTabsPage } from '../person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../exchange-agent-tabs/exchange-agent-tabs';

/**
 * Generated class for the ChooseAccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-choose-access',
  templateUrl: 'choose-access.html',
})
export class ChooseAccessPage {

  constructor(public nvCtrl : NavController, public appState: AppStateService, private auth: AuthProvider,
    private users: UsersService, private app: App) { }

  ngOnInit() {
  }

  login(){
    this.nvCtrl.push(Login)
  }

  registerUser(){
    if( this.appState.currentState.global.userType == '0' ){
      this.nvCtrl.push(CommonRegisterAccountPage)
    }else{
      this.nvCtrl.push(CommonRegisterAccountPage)
    }
  }

  loginWithGoogle(){
    // this.googlePlus.login()
    // .then(res => {
    //   alert(JSON.stringify(res));
    //   this.user.email = JSON.stringify(res);
    // })
    // .catch(err => alert(JSON.stringify(err)));
    this.auth.loginWithGoogle()
    .subscribe( result => {
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
    // this.facebook.login(['public_profile', 'user_friends', 'email'])
    // .then((res: FacebookLoginResponse) => {
    //   alert(JSON.stringify(res));
    //   this.user.email = JSON.stringify(res);
    // })
    // .catch(e => alert(JSON.stringify(e)));
    this.auth.loginWithFacebook()
    .subscribe( result => {
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
        this.nvCtrl.push( CommonRegisterAccountPage, {
          ...result,
          provider: 'FACEBOOK'
        } );
      }
    });
  }

}
