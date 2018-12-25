import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ExchangeAgentMyOfferingsPage } from '../exchange-agent-my-offerings/exchange-agent-my-offerings';
import { CommonMyNotificationsPage } from '../common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../common-my-profile/common-my-profile';
import { TransactionsService } from '../../providers/transaction.service';
import { NotificationsService } from '../../providers/notifications.service';

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
export class ExchangeAgentTabsPage implements OnInit{


  tabHome = ExchangeAgentMyOfferingsPage;
  tabNotifications = CommonMyNotificationsPage;
  tabHistorial = CommonMyTransactionsPage;
  tabProfile = CommonMyProfilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private notifications: NotificationsService,
    private modalCtrl: ModalController) {
    this.notifications.listenToContests(this.modalCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonTabsPage');
  }

  ngOnInit(){
    // alert( JSON.stringify(this.modalCtrl) );
    // this.notifications.listenToContests(this.modalCtrl);
  }

}
