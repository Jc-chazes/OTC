import {Http, Headers} from '@angular/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx'

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient) {
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
}
