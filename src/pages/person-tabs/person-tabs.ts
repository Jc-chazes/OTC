import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
