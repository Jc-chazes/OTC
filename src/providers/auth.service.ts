import {Http, Headers} from '@angular/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx'
import { ExchangeAgent } from '../models/exchange-agent.model';
import { Observable } from 'rxjs/Rx';
import { ApiUtil } from './utils/api.util';
import { pick, omit } from 'lodash';
import { JwtUtil } from './utils/jwt.util';

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient, private api: ApiUtil,
  private jwt: JwtUtil) {
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
      debugger;
      this.jwt.setToken(resp.jwt);
      return true;
    }).catch( err => {
      return Observable.of(false);
    });
  }
}
