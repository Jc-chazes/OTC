import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-registrer-account',
  templateUrl: 'registrer-account.html',
})
export class RegistrerAccountPage {
  show:number;
  checkButton:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.checkButton = 0
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrerAccountPage');
    this.show = 0
  }
  showHide(){
    this.show = 1
  }

  clickUser(numb){
    console.log(numb)
    this.checkButton = numb
  }

}
