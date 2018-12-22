import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ExchangeAgentMyOfferingsPage } from '../exchange-agent-my-offerings/exchange-agent-my-offerings';
import { CommonMyNotificationsPage } from '../common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../common-my-profile/common-my-profile';

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
export class ExchangeAgentTabsPage {


  tabHome = ExchangeAgentMyOfferingsPage;
  tabNotifications = CommonMyNotificationsPage;
  tabHistorial = CommonMyTransactionsPage;
  tabProfile = CommonMyProfilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonTabsPage');
  }

}
