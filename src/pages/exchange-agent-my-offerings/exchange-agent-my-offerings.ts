import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Currency } from '../../models/currency.model';
import { ExchangeAgentOffering } from '../../models/exchange-agent-offering.model';
import { CurrenciesService } from '../../providers/currencies.service';
import { ExchangeAgentOfferingsService } from '../../providers/exchange-agent-offerings.service';
import { Observable } from 'rxjs';
import { MyExchangeAgentOfferings } from '../../providers/specifications/exchange-agent-offering.specification';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { ExchangeAgentMyRequestsPage } from '../exchange-agent-my-requests/exchange-agent-my-requests';
import { ExchangeAgentOfferingGroup } from '../../models/exchang-agent-offering-group.model';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceUtil } from '../../providers/utils/device.util';

/**
 * Generated class for the ExchangeAgentMyOfferingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-my-offerings',
  templateUrl: 'exchange-agent-my-offerings.html',
})
export class ExchangeAgentMyOfferingsPage {

  groupedExchangeAgentOfferingList: ExchangeAgentOfferingGroup[] = [];
  currencyList: Currency[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
  private loading: LoadingUtil, private alert: AlertUtil, private modalCtrl: ModalController, private modals: ModalUtil,
  private currencies: CurrenciesService, private exchangeAgentOfferings: ExchangeAgentOfferingsService,
  private sanitizer: DomSanitizer, public device: DeviceUtil) {
    this.exchangeAgentOfferings.getGroupedExchangeAgentOfferings()
    .subscribe( results => {
      this.groupedExchangeAgentOfferingList = results;
    })
  }

  submit(){
    let createExchangesOperations =  this.groupedExchangeAgentOfferingList
    .map( group => group.exchanges )
    .reduce( (prev,curr) => [...prev,...curr],[])
    .filter( exchange => exchange.hasChanged(['requestedCurrency','requestedCurrencyAmount','receivedCurrency','receivedCurrencyAmount']) )
    .filter( exchange => !!exchange.requestedCurrencyAmount && !!exchange.receivedCurrencyAmount )
    .map( exchange => this.exchangeAgentOfferings.add(exchange) );
    if( createExchangesOperations.length == 0 ){
      this.goToMyRequest();
      return ;
    }else{
      this.loading.show();
      console.log(`Se crearán ${createExchangesOperations.length} cambios.`);
      Observable.forkJoin(
        ...createExchangesOperations
      ).subscribe( results => {
        this.loading.hide();
        this.alert.show('Sus cambios han sido guardados.','Cambios de moneda');
        this.goToMyRequest();
      })
    }
  }

  goToMyRequest(){
    this.navCtrl.push(ExchangeAgentMyRequestsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentTabsHomePage');
  }

  getCurrencyCountryFlag(currency: Currency){
    if(currency.image){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${currency.image.fileUrl}')`);
    }else{
      return null;
    }
  }

}
