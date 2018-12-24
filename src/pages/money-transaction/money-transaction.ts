import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-money-transaction',
  templateUrl: 'money-transaction.html',
})
export class MoneyTransactionPage {
  checkButton:number
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.checkButton=0
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoneyTransactionPage');
  }

  next_page(){
    this.checkButton=1
  }
  next(){

  }

}
