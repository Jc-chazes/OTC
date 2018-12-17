import { Component, OnInit } from '@angular/core';
import { RegistrerAccountPage } from '../registrer-account/registrer-account';
import { NavController } from 'ionic-angular';
import { chooseLogin } from '../chooseLogin/chooseLogin';
import { AuthProvider } from '../../providers/auth.service';
import { User } from '../../models/user.model';
import { PersonTabsPage } from '../person-tabs/person-tabs';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { ExchangeAgentTabsPage } from '../exchange-agent-tabs/exchange-agent-tabs';


@Component({
  selector: 'page-login',
  templateUrl: './login.html',

})
export class Login implements OnInit {

  showPassword = false;
  user = new User();
  exchangeAgent = new ExchangeAgent();

  constructor(public nvCtrl : NavController, private auth: AuthProvider, private appState: AppStateService) {
    this.user.userType = this.appState.currentState.global.userType;
  }

  ngOnInit() {
  }

  login(){
    this.nvCtrl.push(ExchangeAgentsPage)
    if( this.user.password && this.user.email ){
      this.auth.login(this.user).subscribe( results => {
        if(results){
          if( this.user.userType == '0' ){
            this.nvCtrl.push(PersonTabsPage);
          }else {
            this.nvCtrl.push(ExchangeAgentTabsPage);
          }
        }
      })
    }
  }

}
