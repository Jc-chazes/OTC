import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-exchange-agents',
  templateUrl: 'exchange-agents.html',
})
export class ExchangeAgentsPage {

  data =[
    {
      "id": 5,
      "businessName": null,
      "documentNumber": "12345678",
      "address": "jr no se 123",
      "birthdate": null,
      "phone": "123456789",
      "sbsRegistrationNumber": null,
      "type": "0",
      "user": {
        "id": 19,
        "username": "casacambio1",
        "email": "casacambio1@gmail.com",
        "provider": "local",
        "confirmed": true,
        "blocked": false,
        "role": 2,
        "userType": "1"
      },
      "created_at": "2018-12-02T07:14:50.000Z",
      "updated_at": "2018-12-02T07:14:50.000Z",
      "name": "Casa de cambio 1",
      "sbsRegisterNumber": "12345678901",
      "exchangeagentscore": null,
      "score": null
    },
    {
      "id": 6,
      "businessName": null,
      "documentNumber": "12345678",
      "address": "jr no se 123",
      "birthdate": null,
      "phone": "123456789",
      "sbsRegistrationNumber": null,
      "type": "0",
      "user": {
        "id": 19,
        "username": "casacambio1",
        "email": "casacambio1@gmail.com",
        "provider": "local",
        "confirmed": true,
        "blocked": false,
        "role": 2,
        "userType": "1"
      },
      "created_at": "2018-12-02T07:14:50.000Z",
      "updated_at": "2018-12-02T07:14:50.000Z",
      "name": "Casa de cambio 1",
      "sbsRegisterNumber": "12345678901",
      "exchangeagentscore": null,
      "score": null
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentsPage');
  }

}
