import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController, Tabs, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ExchangeAgentMyOfferingsPage } from '../exchange-agent-my-offerings/exchange-agent-my-offerings';
import { CommonMyNotificationsPage } from '../common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../common-my-profile/common-my-profile';
import { TransactionsService } from '../../providers/transaction.service';
import { NotificationsService } from '../../providers/notifications.service';
import { CommonTransactionInProgressPage } from '../common-transaction-in-progress/common-transaction-in-progress';
import { UsersService } from '../../providers/users.service';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { Keyboard } from "@ionic-native/keyboard";
import { componentDestroyed } from '../../helpers/observable.helper';

/**
 * Generated class for the ExchangeAgentTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-tabs',
  templateUrl: 'exchange-agent-tabs.html',
})
export class ExchangeAgentTabsPage implements OnInit, OnDestroy{


  tabHome:any = ExchangeAgentMyOfferingsPage;
  tabNotifications:any = CommonMyNotificationsPage;
  tabHistorial:any = CommonMyTransactionsPage;
  tabProfile:any = CommonMyProfilePage;
  @ViewChild('exchangeTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public notifications: NotificationsService,
    private modalCtrl: ModalController, private transactions: TransactionsService, private users: UsersService,
    private modals: ModalUtil, public platform: Platform, public keyboard: Keyboard) {
      // this.notifications.onTabChangeRequested.subscribe( request => {
      //   this.tabParams = request.data;
      //   this.tabRef.select(request.tabIndex)
      // });
      this.transactions.transactionTabRootChange.subscribe( rootPage => {
        if( rootPage == 'TRANSACTION_IN_PROGRESS' ){
          this.tabHome = CommonTransactionInProgressPage;
        }
        if( rootPage == 'OFFERINGS' ){
          this.tabHome = ExchangeAgentMyOfferingsPage;
        }
      });
      if( this.users.currentUser.currentTransaction ){
        if( this.users.currentUser.isPerson() && !!this.users.currentUser.currentTransaction.userTransactionImage ){
          this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
        }
        // if( this.users.currentUser.isExchangeAgent() && !!this.users.currentUser.currentTransaction.exchangeAgentTransactionImage ){
        //   this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
        // }
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

  ionViewDidLoad() {
    //__alert("ionViewDidLoad PersonTabsPage")
    console.log('ionViewDidLoad PersonTabsPage');
  }

  ngOnDestroy(){
    
  }

  ngOnInit(){
    this.notifications.initListenNotifications( this.modalCtrl, this.tabRef )
    .takeUntil( componentDestroyed(this) )
    .subscribe();
    // alert( JSON.stringify(this.modalCtrl) );
    // this.notifications.listenToContests(this.modalCtrl);
  }

}
