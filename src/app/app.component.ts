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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = ChooseProfilePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AuthProvider, private users: UsersService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.auth.populate()
      .subscribe( couldPopulate => {
        if( couldPopulate ){
          let tabs = null;
          if( this.users.currentUser.userType == '0' ){
            tabs = PersonTabsPage;
          }else {
            tabs = ExchangeAgentTabsPage;
          }
          this.rootPage = tabs;
        }
        splashScreen.hide();
      })
    });
  }
}

