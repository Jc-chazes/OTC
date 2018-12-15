import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Login } from '../login/login';
import { AppStateService } from '../../providers/app-state.service';
import { RegisterExchangeAgentPage } from '../register-exchange-agent/register-exchange-agent';

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

  constructor(public nvCtrl : NavController, private appState: AppStateService) { }

  ngOnInit() {
  }

  login(){
    this.nvCtrl.push(Login)
  }

  registerUser(){
    if( this.appState.currentState.global.userType == '0' ){

    }else{
      this.nvCtrl.push(RegisterExchangeAgentPage)
    }
  }

}
