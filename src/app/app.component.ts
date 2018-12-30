import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = ChooseProfilePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AuthProvider, private users: UsersService, private currencies: CurrenciesService) {
    this.currencies.find()
    .flatMap( (_noop) => {
      return this.auth.populate()
      .map( couldPopulate => {
        if( couldPopulate ){
          let tabs = null;
          if( this.users.currentUser.userType == '0' ){
            tabs = PersonTabsPage;
          }else {
            tabs = ExchangeAgentTabsPage;
          }
          this.rootPage = tabs;
        }
      });
    })
    .flatMap( () => {
      return Observable.fromPromise( platform.ready() )
        .map( () => {
          statusBar.styleDefault();
          splashScreen.hide();   
        })
    })
    .subscribe();
    // .then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      
    // });
  }
}

