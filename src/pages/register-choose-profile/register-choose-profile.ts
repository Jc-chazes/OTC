import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { Login } from '../login/login';
import { RegisterExchangeAgentPage } from '../register-exchange-agent/register-exchange-agent';

/**
 * Generated class for the RegisterChooseProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register-choose-profile',
  templateUrl: 'register-choose-profile.html',
})
export class RegisterChooseProfilePage {

  userType: number = 0;

  constructor(public nav : NavController, private appState: AppStateService) { }

  ngOnInit() {
    
  }

  registerClient(){
    this.userType=0;
  }

  registerHouseChangue(){
    this.userType=1
  }

  ready(){
    if( this.userType == 0){
      this.nav.push(Login);
    }else{
      this.nav.push(RegisterExchangeAgentPage);
    }
  }
}
