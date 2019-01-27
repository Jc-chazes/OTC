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
import { StorageUtil, StorageKeys } from './utils/storage.util';
import { Image } from '../models/shared/image.model';
import { getImageUrl } from '../helpers/images.helper';
import { DeviceUtil } from './utils/device.util';
import { Person } from '../models/person.model';
import { Transaction } from '../models/transaction.model';
import { TransactionMapper } from './mappers/transaction.mapper';
import { CurrenciesService } from './currencies.service';
import { Contest } from '../models/contest.model';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AlertUtil } from './utils/alert.util';
import { Configuration } from '../settings/configuration.settings';
import { BackendMessages, Messages } from '../settings/messages.settings';

@Injectable()
export class AuthProvider {

  transactionMapper: TransactionMapper;

  constructor( public http : HttpClient, private api: ApiUtil, private storage: StorageUtil,
  private jwt: JwtUtil, private appState: AppStateService, private users: UsersService,
  private devices: DeviceUtil, private currencies: CurrenciesService, private alerts: AlertUtil,
  private googlePlus: GooglePlus, private facebook: Facebook) {
    this.transactionMapper = new TransactionMapper(currencies,users);      
  }

  resetPassword(newPassword: string, resetPasswordToken: string): Observable<boolean>{
    return this.api.post('/auth/reset-password',{
      password: newPassword,
      passwordConfirmation: newPassword,
      code: resetPasswordToken
    },{},false).map( resp => {
      return true;
    }).catch( err => {
      console.error(err);
      return Observable.of(false);
    })
  }

  sendResetPasswordEmail(email: string){
    return this.api.post('/auth/forgot-password',{
      email,
      url: Configuration.resetPasswordUrl
    },{},false).map( resp => {
      return true;
    }).catch( err => {
      console.error(err);
      return Observable.of(false);
    })
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

  registerPerson(person: Person, provider: 'FACEBOOK' | 'GOOGLE'): Observable<boolean>{
    return this.api.post('/auth/local/register',{
      ...pick(person.user,[,'email','password','userType']),
      username: person.user.email.substring( 0, person.user.email.indexOf('@') ),
      profile: {
        ...omit(person,['user','score','fullName'])
      },
      provider
    }).flatMap( resp => {
      this.jwt.setToken(resp.jwt);
      return this.populate();
    }).catch( err => {
      if( err.error && err.error.message == BackendMessages["auth.error.emailAlreadyExists"] ){
        this.alerts.show( Messages["auth.error.emailAlreadyExists"], 'Registro' );
      }
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
    }).flatMap( resp => {
      this.jwt.setToken(resp.jwt);
      return this.populate();
    }).catch( err => {
      if( err.error && err.error.message == BackendMessages["auth.error.emailAlreadyExists"] ){
        this.alerts.show( Messages["auth.error.emailAlreadyExists"], 'Registro' );
      }
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

  loginWithGoogle(): Observable<{ email?: string, couldLogin?: boolean, lastName?: string, firstName?: string, canceled?: boolean }>{
    return Observable.fromPromise( this.googlePlus.login({}) )
    .flatMap( resp => {
      return this.api.post('/auth/local',{
        provider: 'GOOGLE',
        accessToken: resp.accessToken
      },{},false)
      .do( resp => {
      })
      .flatMap( resp => {
        if( !resp.error ){
          this.jwt.setToken(resp.jwt);
          return this.populate('0')
          .map( couldPopulate => {
            return { email: '', couldLogin: couldPopulate };
          });
        }else{
          return Observable.of({ ...resp.data, couldLogin: false });
        }          
      }).catch( err => {
        // this.alerts.show('No se pudo realizar el login con Google, por favor inténtelo más tarde ','Error login');
        // alert(JSON.stringify(err));
        return Observable.of({ couldLogin: false });
      });
    })
    .catch( err => {
      // this.alerts.show('No se pudo realizar el login con Google, por favor inténtelo más tarde ','Error login');
      // alert(JSON.stringify(err));
      return Observable.of({ couldLogin: false });
    });
  }

  loginWithFacebook(): Observable<{ email?: string, couldLogin?: boolean, lastName?: string, firstName?: string, canceled?: boolean }>{
    return Observable.fromPromise( this.facebook.login(['public_profile', 'user_friends', 'email']) )
    .flatMap( (res: FacebookLoginResponse) => {
      return this.api.post('/auth/local',{
        provider: 'FACEBOOK',
        accessToken: res.authResponse.accessToken
      },{},false)
      .flatMap( resp => {
        if( !resp.error ){
          this.jwt.setToken(resp.jwt);
          return this.populate('0')
          .map( couldPopulate => {
            return { email: '', couldLogin: couldPopulate };
          });
        }else{
          return Observable.of({ ...resp.data, couldLogin: false });
        }          
      }).catch( err => {
        // this.alerts.show('No se pudo realizar el login con Facebook, por favor inténtelo más tarde ','Error login');
        // alert(JSON.stringify(err));        
        return Observable.of({ couldLogin: false });
      });
    })
    .catch( err => {
      // this.alerts.show('No se pudo realizar el login con Facebook, por favor inténtelo más tarde ','Error login');
      if( err.errorCode ){
        return Observable.of({ couldLogin: false, canceled: true });
      }
      // alert(JSON.stringify(err));  
      return Observable.of({ couldLogin: false });
    });
  }

  logout(): Observable<boolean>{
    this.facebook.logout().then().catch();
    this.googlePlus.logout().then().catch();
    return this.devices.getToken()
    .flatMap( token => {
      // let query = new HttpParams();
      // if(token){
      //   query = query.append('deviceId',token);
      // }
      return this.api.post('/auth/logout',{
        deviceId: token
      })
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
          this.purge();
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
        if( user.isPerson() ){
          user.person.currentContest = resp.profile.currentContest ? new Contest({id:resp.profile.currentContest}) : null;
          user.person.currentTransaction = resp.profile.currentTransaction ? this.transactionMapper.mapFromBe({
            ...resp.profile.currentTransaction,
            person: {
              ...user.person,
              user
            }
          }) : null;
        }else{
          user.exchangeAgent.currentTransaction = resp.profile.currentTransaction ? this.transactionMapper.mapFromBe({
            ...resp.profile.currentTransaction,
            exchangeAgent: {
              ...user.exchangeAgent,
              user
            }
          }) : null;
        }
        return true;      
      }).catch( err => {
        this.purge();
        console.log(err);
        return Observable.of(false);
      });
    });
  }

  purge(){
    this.storage.clear();
    localStorage.setItem(StorageKeys.SLIDER_HAS_BEEN_SHOWED,'{ loaded: true }'); 
  }
  
}
