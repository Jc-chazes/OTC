import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/Rx'
import { ExchangeAgent } from '../models/exchange-agent.model';
import { Observable } from 'rxjs/Rx';
import { ApiUtil } from './utils/api.util';
import { pick, omit } from 'lodash';
import { JwtUtil } from './utils/jwt.util';
import { User } from '../models/user.model';
import { AppStateService } from './app-state.service';
import { UsersService } from './users.service';
import { StorageUtil } from './utils/storage.util';
import { Image } from '../models/shared/image.model';
import { getImageUrl } from '../helpers/images.helper';
import { DeviceUtil } from './utils/device.util';
import { Person } from '../models/person.model';

@Injectable()
export class AuthProvider {

  constructor( public http : HttpClient, private api: ApiUtil, private storage: StorageUtil,
  private jwt: JwtUtil, private appState: AppStateService, private users: UsersService,
  private devices: DeviceUtil) {
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

  registerPerson(person: Person): Observable<boolean>{
    return this.api.post('/auth/local/register',{
      ...pick(person.user,[,'email','password','userType']),
      username: person.user.email.substring( 0, person.user.email.indexOf('@') ),
      profile: {
        ...omit(person,['user','score','fullName'])
      }
    }).map( resp => {
      this.jwt.setToken(resp.jwt);
      return true;
    }).catch( err => {
      return Observable.of(false);
    });
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
    return this.devices.getToken()
    .flatMap( token => {
      let query = new HttpParams();
      if(token){
        query = query.append('deviceId',token);
      }
      return this.api.get('/users/me',{params: query})
      .map( resp => {
        if( !!userTypeToVerify && resp.userType != userTypeToVerify ){
          console.warn('Autenticación fallida para el perfil seleccionado');
          return false;
        }
        let user = new User({
          ...pick(resp,['id','username','email','userType']),
          photo: new Image({
            fileUrl: resp.photo ? getImageUrl( resp.photo.url ) : ''
          }),
          exchangeAgent: {
            ...omit(resp.profile,['user'])
          },
          person: {
            ...omit(resp.profile,['user'])
          }
        });
        this.users.currentUser = user;
        return true;      
      }).catch( err => {
        this.purge();
        return Observable.of(false);
      });
    });
  }

  purge(){
    this.storage.clear();
  }
  
}
