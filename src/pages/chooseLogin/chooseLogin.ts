import { Component, OnInit, ViewChild } from '@angular/core';
import {NavController} from 'ionic-angular';
import { Login } from '../login/login';
import { AppStateService } from '../../providers/app-state.service';
import { RegisterExchangeAgentPage } from '../register-exchange-agent/register-exchange-agent';



@Component({
  selector: 'page-chooseLogin',
  templateUrl: './chooseLogin.html',
})
export class chooseLogin implements OnInit {
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
