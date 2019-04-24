import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { chooseLogin } from '../pages/chooseLogin/chooseLogin';
import { Login } from '../pages/login/login';
import { ChooseAccessPage } from '../pages/choose-access/choose-access';
import { ChooseProfilePage } from '../pages/choose-profile/choose-profile';
import { AuthProvider } from '../providers/auth.service';
import { UsersService } from '../providers/users.service';
import { PersonTabsPage } from '../pages/person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../pages/exchange-agent-tabs/exchange-agent-tabs';
import { Observable } from 'rxjs';
import { CurrenciesService } from '../providers/currencies.service';
import { StorageUtil, StorageKeys } from '../providers/utils/storage.util';
import { SliderPage } from '../pages/slider/slider';
import { Deeplinks, DeeplinkMatch } from '@ionic-native/deeplinks';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AlertUtil } from '../providers/utils/alert.util';
import { LoadingUtil } from '../providers/utils/loading.util';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = ChooseProfilePage;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private background: BackgroundMode,
    private auth: AuthProvider, private users: UsersService, private currencies: CurrenciesService,
    private storage: StorageUtil, private deeplinks: Deeplinks, private app: App, private loading: LoadingUtil) {
    let sliderLoaded = localStorage.getItem(StorageKeys.SLIDER_HAS_BEEN_SHOWED);
    this.loading.show();
    Observable.fromPromise( 
      platform.ready()
      .then( () => {
        //__alert('Plataforma lista');
        return Promise.resolve();
      }).catch( (err)=>{
        //__alert(JSON.stringify(err));
        return Promise.reject(err);
      })
    )
    .do( () => {
      statusBar.styleDefault();
      splashScreen.hide();
    })
    .flatMap( () => {
      //__alert('currencies will be loaded');
      return this.currencies.find()
      .flatMap( (_noop) => {
        //__alert('populate will be loaded');
        return this.auth.populate()
        .map( couldPopulate => {
          //__alert('rootPage will be setted');
          if( !sliderLoaded ){
            localStorage.setItem(StorageKeys.SLIDER_HAS_BEEN_SHOWED,'{ loaded: true }'); 
            this.rootPage = SliderPage
          }else{
            if( couldPopulate ){
              let rootPage = null;
              if( this.users.currentUser.userType == '0' ){
                rootPage = PersonTabsPage;
              }else {
                rootPage = ExchangeAgentTabsPage;
              }
              this.rootPage = rootPage;
            }
          }
        });
      })
      .catch( err => {
        //__alert('Error cargando aplicación:'+JSON.stringify(err));
        return null;
      })
    })
    .catch( err => {
      //__alert('Error cargando aplicación:'+JSON.stringify(err));
      return null;
    })
    .subscribe( () => {
      this.listenToDeepLinks();
      // statusBar.styleDefault();
      // splashScreen.hide();
      // alert('Version 1.2');
      this.loading.hide();
      statusBar.overlaysWebView(false);
      this.configureBackgroundMode();
    });
  }

  listenToDeepLinks(){
    this.deeplinks.route({ '/reset-password': ResetPasswordPage })
    .catch( nomatch => {
      // alert('Error cargando deeplinks:'+JSON.stringify(nomatch));
      return Observable.of(null);
    }).subscribe( (match: DeeplinkMatch) => {
      if( match ){
        if(match.$link.host == '/reset-password'){
          this.app.getRootNav().push(ResetPasswordPage,{
            token: match.$args.token
          });
        }
      }
    });
  }

  configureBackgroundMode(){
    //Habilitar background en ios para recibir las notificaciones
    if( this.platform.is('ios') ){
      this.background.enable();
    }
  }
}

