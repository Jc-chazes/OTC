import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
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
import { CommonTransactionInProgressPage } from '../common-transaction-in-progress/common-transaction-in-progress';
import { Contest } from '../../models/contest.model';
import { Observable } from 'rxjs';
import { ContestsService } from '../../providers/contests.service';
import { UsersService } from '../../providers/users.service';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { NumberPipe } from '../../pipes/numeric/number.pipe';


@Component({
  selector: 'page-detail-exchange-agent',
  templateUrl: 'detail-exchange-agent.html',
})
export class DetailExchangeAgentPage {
  detail_exchangue : any;
  data_price :any;

  transaction: Transaction;
  otcComission: Constant = new Constant({ content: 0 });
  contest: Contest;

  constructor(public navCtrl: NavController, public navParams: NavParams,public appService : AppStateService,
  private sanitizer: DomSanitizer, private constants: ConstantsService, private transactions: TransactionsService,
  private modals: ModalUtil, private modalCtrl: ModalController, private loading: LoadingUtil,
  private contests: ContestsService, private users: UsersService, private numberPipe: NumberPipe) {
    this.transaction = this.navParams.get('transaction');
    this.contest = this.navParams.get('contest');
    this.appService.onStateChange.subscribe(res=>{
      this.detail_exchangue = res.detail_exchangue,
      this.data_price = res.price
    });
    this.constants.findOne( new ConstantByCodeSpecification(`OTC_COMISSION_${this.transaction.exchangeAgentOffering.receivedCurrency}`) )
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
    return this.sanitizer.bypassSecurityTrustStyle(`url('http://157.230.229.87:85/static/imgs/avatar_placeholder.png')`);
  }
  
  continue(){
    this.loading.show();
    if( this.contest ){
      this.transaction.type = 'FAST';
    }
    Observable.forkJoin(
      this.transactions.add( this.transaction ),
      Observable.of(null)//( this.contest ? this.contests.selectWinner(this.contest,this.transaction.exchangeAgent) : Observable.of(null) )
    ).subscribe( ([ createdTransaction, _noop ]) => {
      if( this.users.currentUser.isPerson() ){
        this.users.currentUser.person.currentContest = undefined;
      }
      this.loading.hide();
      if( createdTransaction ){
        if( !!this.contest ){
          this.contests.selectWinner(this.contest,this.transaction.exchangeAgent,createdTransaction.id).subscribe();
        }
        this.modals.openModal(this.modalCtrl,AvailableModals.WaitYourRequestModal,{ isFastRequest: this.transaction.type == 'FAST' })
        .then( () => {
          // if( this.transaction.type == 'FAST' ){
          //   this.loading.show();
          //   this.transactions.findOne( new ByIdSpecification(this.transaction.id) )
          //   .subscribe( transaction => {
          //     this.loading.hide();
          //     this.navCtrl.push(CommonSelectBankAccountPage,{
          //       transaction
          //     });
          //   })
          // }else{
          //   this.transactions.setCurrentTransaction(createdTransaction)
          //   .subscribe( () => {
          //     this.navCtrl.setRoot( CommonTransactionInProgressPage );
          //     this.navCtrl.popToRoot();
          //   });
          // }
          this.transactions.setCurrentTransaction(createdTransaction)
          .subscribe( () => {
            if( this.transaction.type == 'FAST' ){
              this.loading.show();
              this.transactions.findOne( new ByIdSpecification( createdTransaction.id) )
              .subscribe( transaction => {
                this.loading.hide();
                this.navCtrl.push(CommonSelectBankAccountPage,{
                  transaction
                });
              })
            }else{
              this.transactions.setTransactionTabRoot( 'TRANSACTION_IN_PROGRESS' );
              this.navCtrl.setRoot( CommonTransactionInProgressPage );
              this.navCtrl.popToRoot();
            }
          });
        })
      }
    });
    // this.transactions.add( this.transaction )
    // .subscribe( createdTransaction => {
    //   this.loading.hide();
    //   if( createdTransaction ){
    //     this.modals.openModal(this.modalCtrl,AvailableModals.WaitYourRequestModal)
    //     .then( () => {
    //       this.transactions.setCurrentTransaction(createdTransaction)
    //       .subscribe( () => {
    //         this.navCtrl.setRoot( CommonTransactionInProgressPage );
    //         this.navCtrl.popToRoot();
    //       });
    //     })
    //   }
    // })
  }

  get transactionAmount(){
    return this.numberPipe.transform(Number(this.transaction.amount).toFixed(2));
  }

  get transactionAmountToDeposit(){
    return this.numberPipe.transform(this.transaction.amountToDeposit.toFixed(2));
  }

  get transactionAmountToDepositToOTC(){
    return this.numberPipe.transform(this.transaction.amountToDepositToOTC(this.otcComission.content));
  }

  get transactionAmountToReceive(){
    return this.numberPipe.transform(this.transaction.amountToReceive.toFixed(2));
  }
}
