import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Tabs } from 'ionic-angular';
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
export class PersonTabsPage {

  tabHome: any = QuotePage;
  tabNotifications: any = CommonMyNotificationsPage;
  tabHistorial: any = CommonMyTransactionsPage;
  tabProfile: any = CommonMyProfilePage;
  tabParams: any = {};
  @ViewChild('personTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private modals: ModalUtil, private notifications: NotificationsService, private users: UsersService, 
    private transactions: TransactionsService, private alerts: AlertUtil, private loading: LoadingUtil, 
    private contests: ContestsService) {
    this.notifications.listenToContests( this.modalCtrl );
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
    if( this.users.currentUser.currentTransaction ){
      if( this.users.currentUser.isPerson() && !!this.users.currentUser.currentTransaction.userTransactionImage ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
      if( this.users.currentUser.isExchangeAgent() && !!this.users.currentUser.currentTransaction.exchangeAgentTransactionImage ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
      if( this.users.currentUser.currentTransaction.status == '2' ){
        this.transactions.setTransactionTabRoot('TRANSACTION_IN_PROGRESS');
      }
    }
    if( this.users.currentUser.isPerson() ){
      if( this.users.currentUser.person.currentContest ){
        this.alerts.confirm('Tienes una búsqueda rápida en la cola, ¿Deseas continuar?','OTC Búsqueda rápida')
        .then( accepted => {
          if( accepted ){
            this.modals.openModal(this.modalCtrl,AvailableModals.FastSearchModal,{
              contest: {
                id: this.users.currentUser.person.currentContest.id
              }
            });
          }else{
            this.contests.cancelContest( this.users.currentUser.person.currentContest.id )
            .subscribe()
          }
        });
      }
    }
  }

  ionViewDidLoad() {
  }

}
