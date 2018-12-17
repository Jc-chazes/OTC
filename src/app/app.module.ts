import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { chooseLogin } from '../pages/chooseLogin/chooseLogin';
import { Login } from '../pages/login/login';
import { RegistrerAccountPage } from '../pages/registrer-account/registrer-account';
import { AuthProvider } from '../providers/auth.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'
import { HTTP } from '@ionic-native/http';
import { AddBankPage } from '../pages/registrer-account/add-bank/add-bank';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AppStateService } from '../providers/app-state.service';
import { QuotePage } from '../pages/quote/quote';
import { RegisterExchangeAgentPage } from '../pages/register-exchange-agent/register-exchange-agent';
import { ApiUtil } from '../providers/utils/api.util';
import { StorageUtil } from '../providers/utils/storage.util';
import { JwtUtil } from '../providers/utils/jwt.util';
import { RegisterBankAccountPage } from '../pages/register-bank-account/register-bank-account';
import { BaseService } from '../providers/base/base.service';
import { BanksService } from '../providers/banks.service';
import { CurrenciesService } from '../providers/currencies.service';
import { UsersBankAccountsService } from '../providers/users-bank-accounts.service';

import 'rxjs/observable/of';
import { ChooseAccessPage } from '../pages/choose-access/choose-access';
import { PersonTabsPage } from '../pages/person-tabs/person-tabs';
import { ExchangeAgentTabsPage } from '../pages/exchange-agent-tabs/exchange-agent-tabs';
import { ChooseProfilePage } from '../pages/choose-profile/choose-profile';
import { UsersService } from '../providers/users.service';
import { ExchangeAgentOfferingsService } from '../providers/exchange-agent-offerings.service';
import { ExchangeAgentMyOfferingsPage } from '../pages/exchange-agent-my-offerings/exchange-agent-my-offerings';
import { LoadingUtil } from '../providers/utils/loading.util';
import { AlertUtil } from '../providers/utils/alert.util';
import { ComponentsModule } from '../components/components.module';
import { ExchangeAgentMyRequestsPage } from '../pages/exchange-agent-my-requests/exchange-agent-my-requests';
import { TransactionsService } from '../providers/transaction.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    chooseLogin,
    Login,
    RegistrerAccountPage,
    AddBankPage,
    QuotePage,
    RegisterExchangeAgentPage,
    RegisterBankAccountPage,
    ChooseAccessPage,
    PersonTabsPage,
    ExchangeAgentTabsPage,
    ChooseProfilePage,
    ExchangeAgentMyOfferingsPage,
    ExchangeAgentMyRequestsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    chooseLogin,
    Login,
    RegistrerAccountPage,
    AddBankPage,
    QuotePage,
    RegisterExchangeAgentPage,
    RegisterBankAccountPage,
    ChooseAccessPage,
    PersonTabsPage,
    ExchangeAgentTabsPage,
    ChooseProfilePage,
    ExchangeAgentMyOfferingsPage,
    ExchangeAgentMyRequestsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AppStateService,
    StorageUtil,
    JwtUtil,
    ApiUtil,
    AlertUtil,
    LoadingUtil,
    BaseService,
    BanksService,
    CurrenciesService,
    UsersBankAccountsService,
    ExchangeAgentOfferingsService,
    UsersService,
    TransactionsService
  ]
})
export class AppModule {}
