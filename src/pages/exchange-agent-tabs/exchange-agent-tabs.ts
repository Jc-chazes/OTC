import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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


  tabHome = HomePage;
  tabNotifications = HomePage;
  tabHistorial = HomePage;
  tabProfile = HomePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonTabsPage');
  }

}
