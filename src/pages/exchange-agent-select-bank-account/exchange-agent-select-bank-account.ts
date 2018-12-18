import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExchangeAgentSelectBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-select-bank-account',
  templateUrl: 'exchange-agent-select-bank-account.html',
})
export class ExchangeAgentSelectBankAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentSelectBankAccountPage');
  }

}
