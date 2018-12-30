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
import { ExchangeAgentsPage } from '../pages/exchange-agents/exchange-agents';
import { ExchangueAgentService } from '../providers/exchange-agent.service';
import { DataService } from '../providers/data.service';
import { UsersService } from '../providers/users.service';
import { ExchangeAgentOfferingsService } from '../providers/exchange-agent-offerings.service';
import { DetailExchangeAgentPage } from '../pages/detail-exchange-agent/detail-exchange-agent';
import { ModifyAccountBankPage } from '../pages/modify-account-bank/modify-account-bank';
import { ExchangeAgentMyOfferingsPage } from '../pages/exchange-agent-my-offerings/exchange-agent-my-offerings';
import { LoadingUtil } from '../providers/utils/loading.util';
import { AlertUtil } from '../providers/utils/alert.util';
import { ComponentsModule } from '../components/components.module';
import { ExchangeAgentMyRequestsPage } from '../pages/exchange-agent-my-requests/exchange-agent-my-requests';
import { TransactionsService } from '../providers/transaction.service';
import { ExchangeAgentRequestDetailsPage } from '../pages/exchange-agent-request-details/exchange-agent-request-details';
import { PipesModule } from '../pipes/pipes.module';
import { ConstantsService } from '../providers/constants.service';
import { ExchangeAgentSelectBankAccountPage } from '../pages/exchange-agent-select-bank-account/exchange-agent-select-bank-account';
import { CommonSelectBankAccountPage } from '../pages/common-select-bank-account/common-select-bank-account';
import { CommonTransferToOtcPage } from '../pages/common-transfer-to-otc/common-transfer-to-otc';
import { CommonSendVoucherPage } from '../pages/common-send-voucher/common-send-voucher';
import { CommonMyNotificationsPage } from '../pages/common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../pages/common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../pages/common-my-profile/common-my-profile';
import { CommonViewProfilePage } from '../pages/common-view-profile/common-view-profile';
import { CommonMyBankAccountsPage } from '../pages/common-my-bank-accounts/common-my-bank-accounts';
import { CommonMyBankAccountsAddPage } from '../pages/common-my-bank-accounts-add/common-my-bank-accounts-add';
import { PersonNearExchangeAgentsPage } from '../pages/person-near-exchange-agents/person-near-exchange-agents';
import { NotificationsService } from '../providers/notifications.service';
import { Camera } from '@ionic-native/camera';

import moment from 'moment';
moment.locale('es');

import { DirectivesModule } from '../directives/directives.module';
import { ContentsService } from '../providers/contents.service';
import { ModalUtil } from '../providers/utils/modal.util';
import { DeviceUtil } from '../providers/utils/device.util';
import { Device } from '@ionic-native/device';
import { Firebase } from '@ionic-native/firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ContestsService } from '../providers/contests.service';
import { CommonRegisterAccountPage } from '../pages/common-register-account/common-register-account';
import { PersonSelectSearchModePage } from '../pages/person-select-search-mode/person-select-search-mode';
import { CommonTransactionInProgressPage } from '../pages/common-transaction-in-progress/common-transaction-in-progress';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

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
    ExchangeAgentsPage,
    DetailExchangeAgentPage,
    ModifyAccountBankPage,
    ExchangeAgentMyOfferingsPage,
    ExchangeAgentMyRequestsPage,
    ExchangeAgentRequestDetailsPage,
    ExchangeAgentSelectBankAccountPage,
    CommonSelectBankAccountPage,
    CommonTransferToOtcPage,
    CommonSendVoucherPage,
    CommonMyNotificationsPage,
    CommonMyTransactionsPage,
    CommonMyProfilePage,
    CommonViewProfilePage,
    CommonMyBankAccountsPage,
    CommonMyBankAccountsAddPage,
    PersonNearExchangeAgentsPage,
    CommonRegisterAccountPage,
    PersonSelectSearchModePage,
    CommonTransactionInProgressPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCEnU8jfSN9y0dlaKkHU7F9mrEGIeEKy3o",
      authDomain: "otc-dev-e0517.firebaseapp.com",
      databaseURL: "https://otc-dev-e0517.firebaseio.com",
      projectId: "otc-dev-e0517",
      storageBucket: "otc-dev-e0517.appspot.com",
      messagingSenderId: "100315142938"
    }),
    AngularFireAuthModule,
    AngularFirestoreModule
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
    ExchangeAgentsPage,
    ChooseProfilePage,
    DetailExchangeAgentPage,
    ModifyAccountBankPage,
    ExchangeAgentMyOfferingsPage,
    ExchangeAgentMyRequestsPage,
    ExchangeAgentRequestDetailsPage,
    ExchangeAgentSelectBankAccountPage,
    CommonSelectBankAccountPage,
    CommonTransferToOtcPage,
    CommonSendVoucherPage,
    CommonMyNotificationsPage,
    CommonMyTransactionsPage,
    CommonMyProfilePage,
    CommonViewProfilePage,
    CommonMyBankAccountsPage,
    CommonMyBankAccountsAddPage,
    PersonNearExchangeAgentsPage,
    CommonRegisterAccountPage,
    PersonSelectSearchModePage,
    CommonTransactionInProgressPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
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
    ExchangueAgentService,
    DataService,  
    ExchangeAgentOfferingsService,
    UsersService,
    TransactionsService,
    ConstantsService,
    NotificationsService,
    AuthProvider,
    ContentsService,
    ModalUtil,
    DeviceUtil,
    Device,
    Firebase,
    LocalNotifications,
    ContestsService,
    Camera
  ]
})
export class AppModule {}
