import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { DataService } from '../../providers/data.service';
import { Currency } from '../../models/currency.model';
import { CurrenciesService } from '../../providers/currencies.service';
import { AlertUtil } from '../../providers/utils/alert.util';
import { isString } from 'lodash';

@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage {
  checkButton:number;
  selectedCurrency: Currency;
  cant : number;
  text_buy : string;
  text_money:string
  currencyList: Currency[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alerts: AlertUtil
    , private currencies: CurrenciesService, public appState : AppStateService
    , private dataService : DataService) {
    this.checkButton = 0;
    this.currencies.find().subscribe( results => {
      this.currencyList = results.filter( c => c.code != 'PEN' );
      this.selectedCurrency = this.currencyList[0];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotePage');
    this.dataService.getDataExchangueAgents().subscribe(data =>{
      this.dataService.exchange_agents = data
   
  })
  }
  clickUser(numb){
    this.checkButton = numb
  }
  onHandle(event){
    this.selectedCurrency = event
  }
  nextPage(){
    // if(this.checkButton===0){
    //   this.text_buy ='Comprar';     
    // }else if(this.checkButton===1){
    //   this.text_buy = 'Vender';
    // }
    // if(this.selectedCurrency === 1){
    //   this.text_money = "S"
    // }else if(this.selectedCurrency === 2){
    //   this.text_money = "$"
    // }

    if( !this.cant  ){
      this.alerts.show('Ingrese el monto','Cotiza');
      return;
    }

    this.appState.setState({
      price :{ 
        currency : this.selectedCurrency,
        cant : Number(this.cant),
        text_buy : this.checkButton == 0 ? ' Comprar' : 'Vender',//this.text_buy,
        text_money : this.selectedCurrency.symbol
      }
    })
  
    this.navCtrl.push(ExchangeAgentsPage,{
      operation: this.checkButton == 0 ? 'C' : 'V',
      currency: this.selectedCurrency,
      amount : this.cant
    });
  }
}
