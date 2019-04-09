import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController, Tabs, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CommonMyNotificationsPage } from '../common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../common-my-profile/common-my-profile';
import { QuotePage } from '../quote/quote';
import { NotificationsService } from '../../providers/notifications.service';
import { UsersService } from '../../providers/users.service';
import { TransactionsService } from '../../providers/transaction.service';
import { CommonTransactionInProgressPage } from '../common-transaction-in-progress/common-transaction-in-progress';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { ContestsService } from '../../providers/contests.service';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { Transaction } from '../../models/transaction.model';
import { Person } from '../../models/person.model';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { Keyboard } from "@ionic-native/keyboard";
import { componentDestroyed } from '../../helpers/observable.helper';
import { EventsUtil } from '../../providers/utils/events.util';

/**
 * Generated class for the PersonTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-person-tabs',
  templateUrl: 'person-tabs.html',
})
export class PersonTabsPage implements OnInit, OnDestroy{

  tabHome: any = QuotePage;
  tabNotifications: any = CommonMyNotificationsPage;
  tabHistorial: any = CommonMyTransactionsPage;
  tabProfile: any = CommonMyProfilePage;
  tabParams: any = {};
  @ViewChild('personTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private modals: ModalUtil, private notifications: NotificationsService, private users: UsersService, 
    private transactions: TransactionsService, private alerts: AlertUtil, private loading: LoadingUtil, 
    private contests: ContestsService, public platform: Platform, public keyboard: Keyboard,
    public events: EventsUtil) {    
    // this.modals.openModal(this.modalCtrl,AvailableModals.ScoreYourExperienceModal,{
    //   transaction: new Transaction({
    //     person: new Person({id:this.users.currentUser.person.id}),
    //     exchangeAgent: new ExchangeAgent({id:50})
    //   })
    // });
    this.notifications.onTabChangeRequested.subscribe( request => {
      this.tabParams = request.data;
      this.tabRef.select(request.tabIndex)
    });
    this.transactions.transactionTabRootChange.subscribe( rootPage => {
      if( rootPage == 'TRANSACTION_IN_PROGRESS' ){
        this.tabHome = CommonTransactionInProgressPage;
      }
      if( rootPage == 'QUOTE' ){
        this.tabHome = QuotePage;
      }
    });
    let { currentTransaction } = this.users.currentUser;
    if( currentTransaction ){
      if( this.users.currentUser.isPerson() && !!currentTransaction.userTransactionImage ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
      if( this.users.currentUser.isExchangeAgent() && !!currentTransaction.exchangeAgentTransactionImage ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
      if( currentTransaction.type == 'SAFE' && currentTransaction.status == '2' ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
    }
    this.transactions.checkForOfficeHours(this.modalCtrl);

    this.platform.ready().then(() => {
      this.keyboard.onKeyboardShow()
      .takeUntil( componentDestroyed(this) )
      .subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });
  
      this.keyboard.onKeyboardHide()
      .takeUntil( componentDestroyed(this) )
      .subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });
    });
  }

  ngOnInit(){
    this.notifications.initListenNotifications( this.modalCtrl, this.tabRef )
    .takeUntil( componentDestroyed(this) )
    .subscribe();
  }

  ngOnDestroy(){
    
  }

  ionViewDidLoad() {
  }

}
