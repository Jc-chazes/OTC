import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ExchangeAgentOffering } from '../../models/exchange-agent-offering.model';
import { CurrenciesService } from '../../providers/currencies.service';
import { ExchangeAgentOfferingsService } from '../../providers/exchange-agent-offerings.service';
import { Currency } from '../../models/currency.model';
import { MyExchangeAgentOfferings } from '../../providers/specifications/exchange-agent-offering.specification';
import { Observable } from 'rxjs';
import { flattenDeep } from 'lodash';

/**
 * Generated class for the ExchangeAgentTabsHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-tabs-home',
  templateUrl: 'exchange-agent-tabs-home.html',
})
export class ExchangeAgentTabsHomePage {

  groupedExchangeAgentOfferingList: { currency: Currency, exchanges: ExchangeAgentOffering[] }[] = [];
  currencyList: Currency[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private currencies: CurrenciesService, private exchangeAgentOfferings: ExchangeAgentOfferingsService) {
    Observable.forkJoin(
      this.currencies.find(),
      this.exchangeAgentOfferings.find( new MyExchangeAgentOfferings() )
    ).subscribe( results => {
      this.currencyList = results[0];
      let exchangeAgentOfferingList = results[1];
      this.currencyList
      .filter( c => c.code != 'PEN' )
      .forEach( currency => {
        //Compra
        let buyExchange = exchangeAgentOfferingList.find( e => e.requestedCurrency == currency.code ) || new ExchangeAgentOffering({
          receivedCurrency: 'PEN',
          receivedCurrencyAmount: 0,
          requestedCurrency: currency.code,
          requestedCurrencyAmount: 1,
          type: 'C',
          active: true
        });
        buyExchange.createBackup();
        //Venta
        let sellExchange = exchangeAgentOfferingList.find( e => e.receivedCurrency == currency.code ) || new ExchangeAgentOffering({
          requestedCurrency: 'PEN',
          requestedCurrencyAmount: 0,
          receivedCurrency: currency.code,
          receivedCurrencyAmount: 1,
          type: 'V',
          active: true
        });
        sellExchange.createBackup();
        this.groupedExchangeAgentOfferingList.push( { currency, exchanges: [buyExchange, sellExchange] } );
      })
    })
  }

  submit(){
    let createExchangesOperations =  this.groupedExchangeAgentOfferingList
    .map( group => group.exchanges )
    .reduce( (prev,curr) => [...prev,...curr],[])
    .filter( exchange => exchange.hasChanged(['requestedCurrency','requestedCurrencyAmount','receivedCurrency','receivedCurrencyAmount']) )
    .map( exchange => this.exchangeAgentOfferings.add(exchange) );
    if( createExchangesOperations.length == 0 ){
      return ;
    }else{
      console.log(`Se crearán ${createExchangesOperations.length} cambios.`);
      Observable.forkJoin(
        ...createExchangesOperations
      ).subscribe( results => {
        alert('Cambios creados con éxito!');
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentTabsHomePage');
  }

}
