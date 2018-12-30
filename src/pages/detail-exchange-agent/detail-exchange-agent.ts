import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ModifyAccountBankPage } from '../modify-account-bank/modify-account-bank';
import { ExchangeAgent } from '../../models/exchange-agent.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Transaction } from '../../models/transaction.model';
import { Constant } from '../../models/constant.model';
import { ConstantsService } from '../../providers/constants.service';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';
import { TransactionsService } from '../../providers/transaction.service';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { QuotePage } from '../quote/quote';
import { CommonTransactionInProgressPage } from '../common-transaction-in-progress/common-transaction-in-progress';


@Component({
  selector: 'page-detail-exchange-agent',
  templateUrl: 'detail-exchange-agent.html',
})
export class DetailExchangeAgentPage {
  detail_exchangue : any;
  data_price :any;

  transaction: Transaction;
  otcComission: Constant = new Constant({ content: 0 });

  constructor(public navCtrl: NavController, public navParams: NavParams,public appService : AppStateService,
  private sanitizer: DomSanitizer, private constants: ConstantsService, private transactions: TransactionsService,
  private modals: ModalUtil, private modalCtrl: ModalController, private loading: LoadingUtil) {
    this.transaction = this.navParams.get('transaction');
    this.appService.onStateChange.subscribe(res=>{
      this.detail_exchangue = res.detail_exchangue,
      this.data_price = res.price
    });
    this.constants.findOne( new ConstantByCodeSpecification(`OTC_COMISSION_${this.transaction.exchangeAgentOffering.requestedCurrency}`) )
    .subscribe( result => {
      this.otcComission = result;
      this.otcComission.content = Number(this.otcComission.content);
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

  getAvatarUrl(exchangeAgent: ExchangeAgent){
    if( exchangeAgent.user && exchangeAgent.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${exchangeAgent.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }
  
  continue(){
    this.loading.show();
    this.transactions.add( this.transaction )
    .subscribe( result => {
      this.loading.hide();
      if( result ){
        this.modals.openModal(this.modalCtrl,AvailableModals.WaitYourRequestModal)
        .then( () => {
          this.transactions.setCurrentTransaction(result)
          .subscribe( () => {
            this.navCtrl.setRoot( CommonTransactionInProgressPage );
            this.navCtrl.popToRoot();
          });
        })
      }
    })
  }
}
