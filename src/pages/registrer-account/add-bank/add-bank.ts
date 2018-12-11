import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegistrerAccountPage } from '../registrer-account';
import { FormGroup ,FormControl,Validators} from '@angular/forms';

@Component({
  selector: 'page-add-bank',
  templateUrl: 'add-bank.html',
})
export class AddBankPage {
  currency : number ;
  addBankForm : FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currency = 2
  }

  ionViewWillLoad() {
    this.addBankForm = new FormGroup({
     'holderName' : new FormControl(),
     'accountNumber' : new FormControl(),
     'apellative' : new FormControl(),
    })
    console.log('ionViewDidLoad AddBankPage');
  }
  selectCurrency(type){
    this.currency = type
  }
  saveBank(){
    
    this.navCtrl.push(RegistrerAccountPage)
  }

}
