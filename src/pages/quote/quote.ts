import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';


@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage {
  checkButton:number;
  selectCurrency:number;
  cant : number
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appState : AppStateService) {
    this.checkButton = 0;
    this.selectCurrency = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotePage');
  }
  clickUser(numb){
    this.checkButton = numb
  }
  onHandle(event){
    this.selectCurrency = event
  }
  nextPage(){
    this.appState.setState({
      price :{ 
        currency : this.selectCurrency,
        cant : this.cant
      }
    })
  this.navCtrl.push(ExchangeAgentsPage)  
  }
}
