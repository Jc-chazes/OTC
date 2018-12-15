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

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient, private api: ApiUtil,
  private jwt: JwtUtil, private appState: AppStateService) {
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
    },{},false).map( resp => {
      this.jwt.setToken(resp.jwt);
      return true;
    }).catch( err => {
      return Observable.of(false);
    });
  }
}
