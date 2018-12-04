import {Http, Headers} from '@angular/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient) {
    console.log('Hello AuthProvider Provider');
  }
  registrerUserNatural() {
    const url = 'http://localhost:1337/auth/local/register'
    // this.http.post(url,body,{headers:headers})
  }
}
