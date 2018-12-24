import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationsService } from '../../providers/notifications.service';
import { Notification } from '../../models/notification.model';
import { MyNotificationsSpecification } from '../../providers/specifications/notification.specification';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { Transaction } from '../../models/transaction.model';

/**
 * Generated class for the CommonMyNotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-my-notifications',
  templateUrl: 'common-my-notifications.html',
})
export class CommonMyNotificationsPage {

  notificationList: Notification[];
  transactionList: Transaction[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private notifications: NotificationsService,
    private loading: LoadingUtil) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyNotificationsPage');
  }

  ionViewWillEnter(){
    this.loading.show();
    this.notifications.find( new MyNotificationsSpecification() )
    .subscribe( results => {
      this.notificationList = results;
      this.transactionList = this.notifications.buildNotificationsGroups(this.notificationList);
      this.loading.hide();
    })
  }

}
