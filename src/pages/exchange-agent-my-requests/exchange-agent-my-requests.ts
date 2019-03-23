import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { ExchangeAgentOfferingsService } from '../../providers/exchange-agent-offerings.service';
import { ExchangeAgentOffering } from '../../models/exchange-agent-offering.model';
import { Currency } from '../../models/currency.model';
import { ExchangeAgentOfferingGroup } from '../../models/exchang-agent-offering-group.model';
import { TransactionsService } from '../../providers/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { MyPendingTransactions } from '../../providers/specifications/transaction.specification';
import { DomSanitizer } from '@angular/platform-browser';
import { ExchangeAgentRequestDetailsPage } from '../exchange-agent-request-details/exchange-agent-request-details';
import { RejectAcceptRequestPopoverComponent } from '../../components/reject-accept-request-popover/reject-accept-request-popover';
import { RejectWarningComponent } from '../../components/reject-warning/reject-warning';
import { RejectReasonSelectComponent } from '../../components/reject-reason-select/reject-reason-select';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { UsersService } from '../../providers/users.service';
import { CommonTransferToOtcPage } from '../common-transfer-to-otc/common-transfer-to-otc';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';
import { AlertUtil } from '../../providers/utils/alert.util';
import { componentDestroyed } from '../../helpers/observable.helper';
import { EventsUtil } from '../../providers/utils/events.util';

/**
 * Generated class for the ExchangeAgentMyRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-my-requests',
  templateUrl: 'exchange-agent-my-requests.html',
})
export class ExchangeAgentMyRequestsPage implements OnDestroy, OnInit {
  
  youHaveAPendingTransaction = 'Cuentas con una solicitud de búsqueda rápida pendiente, te dirigimos a ella para que puedas completarla lo más pronto posible';
  groupedExchangeList: ExchangeAgentOfferingGroup[];
  pendingTransactionList: Transaction[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer,
    private exchangeAgentOfferings: ExchangeAgentOfferingsService, private transactions: TransactionsService,
    private popoverCtrl: PopoverController, private modalCtrl: ModalController, private loading: LoadingUtil,
    private users: UsersService, private alerts: AlertUtil, private events: EventsUtil) {
    this.exchangeAgentOfferings.getGroupedExchangeAgentOfferings()
    .subscribe( results => {
      this.groupedExchangeList = results;
    });

    this.events.reloadPendingTransactions
    .takeUntil( componentDestroyed(this) )
    .subscribe( () => {
      this.refresh();
    });
  }

  ngOnInit(){
    this.events.exchangeAgentRequestsIsShowing.next(true);
  }
  
  ngOnDestroy(){
    this.events.exchangeAgentRequestsIsShowing.next(false);
  }

  doRefresh(refresher) {
    this.refresh(false);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  refresh( showLoading: boolean = true){
    showLoading && this.loading.show();

    setTimeout(() => {
      this.transactions.find( new MyPendingTransactions() )
      .subscribe( results => {
        showLoading && this.loading.hide();
        this.pendingTransactionList = results;
        this.pendingTransactionList = this.pendingTransactionList.filter( t => !t.exchangeAgentTransactionImage );
        let pendingFastTransaction = this.transactions.findActiveFastTypeTransaction( results );
        if( !!pendingFastTransaction ){
          this.alerts.show(this.youHaveAPendingTransaction,'Mis solicitudes');
          return this.navCtrl.push( ExchangeAgentRequestDetailsPage, {
            transaction: pendingFastTransaction
          });
        }
      });
    }, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentMyRequestsPage');
  }

  ionViewWillEnter(){
    let { currentTransaction } = this.users.currentUser;
    if( currentTransaction && currentTransaction.type == 'FAST' ){
      let currentTransactionStep = this.transactions.getCurrentStepForTransaction(this.users.currentUser,currentTransaction);
      switch( currentTransactionStep ){
        case 'PENDING_TO_ACCEPT':
          this.alerts.show(this.youHaveAPendingTransaction,'Mis solicitudes');
          return this.navCtrl.push( ExchangeAgentRequestDetailsPage, {
            transaction: currentTransaction
          });
          // break;
        case 'BANK_ACCOUNT_REQUIRED':
          this.alerts.show(this.youHaveAPendingTransaction,'Mis solicitudes');
          return this.navCtrl.push( CommonSelectBankAccountPage, {
            transaction: currentTransaction
          });
          // break;
        case 'UPLOAD_PHOTO':
          this.alerts.show(this.youHaveAPendingTransaction,'Mis solicitudes');
          return this.navCtrl.push( CommonTransferToOtcPage, {
            transaction: currentTransaction
          });
          // break;
        default:
          break;
      }
      // if( !currentTransaction.exchangeAgentBankAccount ){
      //   this.navCtrl.push( CommonSelectBankAccountPage, {
      //     transaction: currentTransaction
      //   });
      // }else{
      //   this.navCtrl.push( CommonTransferToOtcPage, {
      //     transaction: currentTransaction
      //   });
      // }
    }
    this.refresh();
  }

  getAvatarUrl(transaction: Transaction){
    if( transaction.person.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${transaction.person.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }

  goToRequestDetails(transaction: Transaction){
    // if( this.canContinue( transaction ) ){
    //   this.navCtrl.push(CommonTransferToOtcPage,{
    //     transaction
    //   })
    //   return;
    // }
    if( transaction.status == '2' && transaction.type == 'SAFE' && transaction.isExpired ){
      this.alerts.show('La solicitud seleccionada ya expiró','Mis solicitudes');;
      this.refresh();
      return;
    }
    let transactionStep = this.transactions.getCurrentStepForTransaction(this.users.currentUser,transaction);
    switch (transactionStep){
      case 'PENDING_TO_ACCEPT':
        this.navCtrl.push( ExchangeAgentRequestDetailsPage, { 
          transaction
        });
        break;
      case 'BANK_ACCOUNT_REQUIRED':
        this.navCtrl.push( CommonSelectBankAccountPage, { 
          transaction
        });
        break;
      case 'UPLOAD_PHOTO':
        // this.navCtrl.push( CommonTransferToOtcPage, { 
        //   transaction
        // });
        this.navCtrl.push( CommonSelectBankAccountPage, { 
          transaction,
          next: true
        });
        break;
      case 'PENDING_FROM_OTC':
        this.alerts.show('Esta solicitud está pendiente de ser validada por OTC','Solicitudes');
        break;
      case 'FINISHED':
      case 'REJECTED':
        this.alerts.show('Esta solicitud ya no puede ser procesada, actualizamos tus solicitud para que ya no aparezca...','Solicitudes');
        this.refresh();
        break;
    }
  }

  openRequestOperations(transaction: Transaction, event){
    // if( this.canContinue( transaction ) ){
    //   this.navCtrl.push(CommonTransferToOtcPage,{
    //     transaction
    //   })
    //   return;
    // }
    if( transaction.status == '2' ){
      let rejectAcceptPopover = this.popoverCtrl.create(RejectAcceptRequestPopoverComponent);
      rejectAcceptPopover.present({
        ev: event
      });
      rejectAcceptPopover.onDidDismiss( operation => {
        if( !operation ) return;
        if( operation == 'REJECT' ){
          this.onReject(transaction);
        }else if( operation == 'VIEW' ){
          // this.navCtrl.push( ExchangeAgentRequestDetailsPage, { 
          //   transaction
          // });
          this.goToRequestDetails(transaction);
        }
      });
    }else{
      this.goToRequestDetails(transaction);      
    }
  }

  onReject(transaction: Transaction){
    let rejectModal = this.modalCtrl.create(RejectWarningComponent,{},{ cssClass: 'rejectWarningModal' });
    rejectModal.present();
    rejectModal.onDidDismiss( rejected => {
      if( rejected === true ){
        this.selectRejectReason(transaction);    
      }else if( rejected === false ){
        this.navCtrl.push( ExchangeAgentRequestDetailsPage, { 
          transaction
        });
      }else{

      }
    });
  }

  selectRejectReason(transaction: Transaction){
    let rejectReasonSelectModal = this.modalCtrl.create(RejectReasonSelectComponent,{},{ showBackdrop: true, enableBackdropDismiss: true, cssClass: 'rejectReasonSelectModal' });
    rejectReasonSelectModal.present();
    rejectReasonSelectModal.onDidDismiss( reason => {
      if( reason ){
        transaction.rejectionReason = reason;
        this.loading.show();
        this.transactions.rejectTransaction( transaction )
        .subscribe( couldReject => {
          this.loading.hide();
          if( couldReject ){
            this.refresh();
          }
        })
      }
    });  
  }

  canContinue(transaction: Transaction){
    return transaction.type == 'FAST' || transaction.status == '3';
    // return ( this.users.currentUser.userType == '0' && !!transaction.personBankAccount ) || 
    //   ( this.users.currentUser.userType == '1' && !!transaction.exchangeAgentBankAccount );

  }

  showCountdown(transaction: Transaction){
    return transaction.type == 'SAFE' &&  transaction.status == '2' ;
  }

  showMoreOptions(transaction: Transaction){
    return transaction.status == '2' && transaction.type == 'SAFE';
  }

  showFastFlag(transaction: Transaction){
    return transaction.type == 'FAST';
  }

}
