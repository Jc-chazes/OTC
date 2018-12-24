import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ModifyAccountBankPage } from '../modify-account-bank/modify-account-bank';


@Component({
  selector: 'page-detail-exchange-agent',
  templateUrl: 'detail-exchange-agent.html',
})
export class DetailExchangeAgentPage {
  detail_exchangue : any;
  data_price :any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public appService : AppStateService) {
  this.appService.onStateChange.subscribe(res=>{
    this.detail_exchangue = res.detail_exchangue,
    this.data_price = res.price
    })
  }
  public counter(i: number) {
    return new Array(i);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailExchangeAgentPage', this.detail_exchangue );
  }

  nextPage(){
    this.navCtrl.push(ModifyAccountBankPage)
  }
}
