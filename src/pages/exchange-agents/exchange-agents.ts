import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataService } from '../../providers/data.service';
import { DetailExchangeAgentPage } from '../detail-exchange-agent/detail-exchange-agent';
import { AppStateService } from '../../providers/app-state.service';
import { Currency } from '../../models/currency.model';
import { SelectExchangeAgentSearchPopoverComponent } from '../../components/select-exchange-agent-search-popover/select-exchange-agent-search-popover';
import { ExchangueAgentService } from '../../providers/exchange-agent.service';
import { SearchExchangeAgentSpecification } from '../../providers/specifications/exchange-agent.specification';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { Transaction } from '../../models/transaction.model';
import { TransactionMapper } from '../../providers/mappers/transaction.mapper';
import { CurrenciesService } from '../../providers/currencies.service';
import { UsersService } from '../../providers/users.service';
import { NotificationsService } from '../../providers/notifications.service';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';


@Component({
  selector: 'page-exchange-agents',
  templateUrl: 'exchange-agents.html',
})
export class ExchangeAgentsPage {
  searchTerm: string = '';
  searchControl: FormControl;
  exchangeAgentList:any;
  searching: any = false;
  data_price :any;
  exchange_agent:any

  currency: Currency;  
  operation: 'C' | 'V';
  sortBy: string;
  amount: number;
  transactionMapper: TransactionMapper;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
  public appService : AppStateService, private popoverCtrl: PopoverController, private exchangeAgents: ExchangueAgentService,
  private sanitizer: DomSanitizer, private loading: LoadingUtil, private currencies: CurrenciesService,
  private users: UsersService, private notifications: NotificationsService) {
    this.transactionMapper = new TransactionMapper(currencies,users);
    this.currency = this.navParams.get('currency');
    this.operation = this.navParams.get('operation');
    this.amount = this.navParams.get('amount');

    this.searchControl = new FormControl();

    this.appService.onStateChange.subscribe(res=>{
      this.data_price = res.price
      })
     
      console.log('DATAs',this.dataService.exchange_agents)
  }
  public counter(i: number) {
    return new Array(i);
  }
  
  ionViewWillEnter() {
    // this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search  => {
      this.searching = false;
      this.refresh();
    });
    this.refresh();
    this.notifications.onTabChangeRequested.subscribe( request => {
      if(request.type == 'ACCEPTED_BY_EXCHANGE_AGENT'){
        this.navCtrl.push(CommonSelectBankAccountPage,{
          transaction: request.data.transaction
        })
      }
    })
  }

  ionViewWillLoad(){
    this.exchange_agent=this.dataService.exchange_agents
  }
  onSearchInput(){
  this.searching = true;
    }

  setFilteredItems() {
      this.exchangeAgentList = this.filterItems(this.searchTerm);
    
  }

  

  filterItems(searchTerm){
    return this.exchange_agent.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ;
    });    

}
  public detailExchangeAgent(exchangeAgent :ExchangeAgent){
    this.appService.setState({detail_exchangue:exchangeAgent})
    this.navCtrl.push(DetailExchangeAgentPage,{
      transaction: this.transactionMapper.mapFromBe({
        status: '2',
        amount: this.amount,
        exchangeAgent,
        person: {
          ...this.users.currentUser.person,
          user: this.users.currentUser
        },
        exchangeAgentOffering: exchangeAgent.exchangeAgentOfferings[0]
      })
    });
  }

  refresh(){
    this.loading.show();
    this.exchangeAgents.search(
      new SearchExchangeAgentSpecification(this.searchControl.value,'SAFE',this.operation,this.currency,this.sortBy)
    ).subscribe( (results: ExchangeAgent[]) => {
      this.loading.hide();
      this.exchangeAgentList = results.filter( ea => ea.exchangeAgentOfferings.length > 0 );
    })
  }

  openSearchExchangeAgentMode(){
    let selectExchangeAgentPopover = this.popoverCtrl.create(SelectExchangeAgentSearchPopoverComponent);
    selectExchangeAgentPopover.present({
      ev: event
    });
    selectExchangeAgentPopover.onDidDismiss( sortBy => {
      if( sortBy ){
        this.sortBy = sortBy;
        this.refresh();
      }
    })
  }

  get currencyAmountField(): string{
    return this.operation == 'V' ? 'requestedCurrencyAmount' : 'receivedCurrencyAmount'
  }

  getAvatarUrl(exchangeAgent: ExchangeAgent){
    if( exchangeAgent.user && exchangeAgent.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${exchangeAgent.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }

}
