import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { DataService } from '../../providers/data.service';


@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage {
  checkButton:number;
  selectCurrency:number;
  cant : number;
  text_buy : string;
  text_money:string
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appState : AppStateService,private dataService : DataService) {
    this.checkButton = 0;
    this.selectCurrency = 1;
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
    this.selectCurrency = event
  }
  nextPage(){
    if(this.checkButton===0){
      this.text_buy ='Comprar';     
    }else if(this.checkButton===1){
      this.text_buy = 'Vender';
    }
    if(this.selectCurrency === 1){
      this.text_money = "S"
    }else if(this.selectCurrency === 2){
      this.text_money = "$"
    }
    this.appState.setState({
      price :{ 
        currency : this.selectCurrency,
        cant : Number(this.cant),
        text_buy : this.text_buy,
        text_money :this.text_money
      }
    })
  
  this.navCtrl.push(ExchangeAgentsPage)  
  }
}
