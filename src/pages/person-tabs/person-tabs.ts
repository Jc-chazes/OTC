import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CommonMyNotificationsPage } from '../common-my-notifications/common-my-notifications';
import { CommonMyTransactionsPage } from '../common-my-transactions/common-my-transactions';
import { CommonMyProfilePage } from '../common-my-profile/common-my-profile';
import { QuotePage } from '../quote/quote';
import { NotificationsService } from '../../providers/notifications.service';

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

  tabHome = QuotePage;
  tabNotifications = CommonMyNotificationsPage;
  tabHistorial = CommonMyTransactionsPage;
  tabProfile = CommonMyProfilePage;
  tabParams: any = {};
  @ViewChild('personTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private notifications: NotificationsService) {
    this.notifications.listenToContests( this.modalCtrl );
    this.notifications.onTabChangeRequested.subscribe( request => {
      this.tabParams = request.data;
      this.tabRef.select(request.tabIndex)
    })
  }

  ionViewDidLoad() {
  }

}
