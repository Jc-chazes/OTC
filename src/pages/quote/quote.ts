import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { DataService } from '../../providers/data.service';
import { Currency } from '../../models/currency.model';
import { CurrenciesService } from '../../providers/currencies.service';
import { AlertUtil } from '../../providers/utils/alert.util';
import { isString } from 'lodash';
import { PersonSelectSearchModePage } from '../person-select-search-mode/person-select-search-mode';
import { UsersService } from '../../providers/users.service';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';
import { CommonTransferToOtcPage } from '../common-transfer-to-otc/common-transfer-to-otc';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { ContestsService } from '../../providers/contests.service';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { Contest } from '../../models/contest.model';

@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage implements OnInit {
  checkButton:number;
  selectedCurrency: Currency;
  cant : number;
  text_buy : string;
  text_money:string
  currencyList: Currency[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alerts: AlertUtil
    , private currencies: CurrenciesService, public appState : AppStateService
    , private dataService : DataService, private users: UsersService, private modals: ModalUtil,
    private modalCtrl: ModalController, private contests: ContestsService) {
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

  ionViewWillEnter(){
  }

  ngOnInit(){
    this.interceptVerifyCurrenTransaction();
  }

  interceptVerifyCurrenTransaction(){
    let { currentTransaction } = this.users.currentUser.person;
    if( !!currentTransaction ){
      if( !currentTransaction.personBankAccount ){
        this.navCtrl.push(CommonSelectBankAccountPage,{ transaction: currentTransaction });
      }else{
        this.navCtrl.push(CommonTransferToOtcPage,{ transaction: currentTransaction });
      }
    }
    if( this.users.currentUser.isPerson() ){
      if( this.users.currentUser.person.currentContest ){
        this.alerts.confirm('Tienes una búsqueda rápida en la cola, ¿Deseas continuar?','OTC Búsqueda rápida')
        .then( accepted => {
          if( accepted ){
            this.modals.openModal(this.modalCtrl,AvailableModals.FastSearchModal,{
              contest: {
                id: this.users.currentUser.person.currentContest.id
              }
            }).then( (contest: Contest) => {
              if( contest ){
                this.contests.findOne( new ByIdSpecification( contest.id ) )
                .subscribe( result => {
                  this.users.currentUser.person.currentContest = result;
                  this.navCtrl.push(ExchangeAgentsPage,{
                    operation: result.operationType,
                    currency: result.targetCurrency,
                    amount: result.amount,
                    contest: result
                  });
                })
              }
            })
          }else{
            this.contests.cancelContest( this.users.currentUser.person.currentContest.id )
            .subscribe()
          }
        });
      }
    }
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
    console.log(this.cant);
    if( !this.cant || this.cant > 10000 ){
      this.alerts.show('Monto inválido','Cotiza');
      return;
    }

    this.appState.setState({
      price :{ 
        currency : this.selectedCurrency,
        cant : Number(this.cant),
        text_buy : this.checkButton == 0 ? ' Compra' : 'Venta',//this.text_buy,
        text_money : this.selectedCurrency.symbol
      }
    })
  
    this.navCtrl.push(PersonSelectSearchModePage,{
      operation: this.checkButton == 0 ? 'C' : 'V',
      currency: this.selectedCurrency,
      amount : this.cant
    });
  }
}
