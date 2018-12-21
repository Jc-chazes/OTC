import {Http, Headers} from '@angular/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx'
import { ExchangeAgent } from '../models/exchange-agent.model';
import { Observable } from 'rxjs/Rx';
import { ApiUtil } from './utils/api.util';
import { pick, omit } from 'lodash';
import { JwtUtil } from './utils/jwt.util';
import { User } from '../models/user.model';
import { AppStateService } from './app-state.service';
import { UsersService } from './users.service';
import { NavController } from 'ionic-angular';
import { PersonTabsPage } from '../pages/person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../pages/exchange-agent-tabs/exchange-agent-tabs';
import { StorageUtil } from './utils/storage.util';

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient, private api: ApiUtil, private storage: StorageUtil,
  private jwt: JwtUtil, private appState: AppStateService, private users: UsersService) {
  }

  setAppUserType(userType: string){
    let currentGlobal = this.appState.currentState.global;
    this.appState.setState({
      global: {
        ...currentGlobal,
        userType
      }
    })
  }

  registrerUser(data) {
    const url = 'http://104.236.19.32:60/auth/local/register'
    let headers = {
      'Content-Type': 'application/json'
    }
    return this.http.post(url,data,{headers:headers}).map(res =>{
              return res
          })
  }

  registerExchangeAgent(exchangeAgent: ExchangeAgent): Observable<boolean>{
    return this.api.post('/auth/local/register',{
      ...pick(exchangeAgent.user,[,'email','password','userType']),
      username: exchangeAgent.user.email.substring( 0, exchangeAgent.user.email.indexOf('@') ),
      profile: {
        ...omit(exchangeAgent,['user','score'])
      }
    }).map( resp => {
      this.jwt.setToken(resp.jwt);
      return true;
    }).catch( err => {
      return Observable.of(false);
    });
  }

  login(user: User): Observable<boolean>{
    return this.api.post('/auth/local',{
      identifier: user.email,
      password: user.password
    },{},false)
    .flatMap( resp => {
      this.jwt.setToken(resp.jwt);
      return this.populate(user.userType);
    }).catch( err => {
      return Observable.of(false);
    });
  }

  populate(userTypeToVerify?: string): Observable<boolean>{
    return this.api.get('/users/me')
    .map( resp => {
      if( !!userTypeToVerify && resp.userType != userTypeToVerify ){
        console.warn('Autenticación fallida para el perfil seleccionado');
        return false;
      }
      let user = new User({
        ...pick(resp,['id','username','email','userType']),
        exchangeAgent: {
          ...omit(resp.profile,['user'])
        }
      });
      this.users.currentUser = user;
      return true;      
    }).catch( err => {
      this.purge();
      return Observable.of(false);
    });
  }

  purge(){
    this.storage.clear();
  }

  getTabsByUserType(){
    if( this.users.currentUser.userType == '0' ){
      return PersonTabsPage;
    }else {
      return ExchangeAgentTabsPage;
    }
  }
  
}
