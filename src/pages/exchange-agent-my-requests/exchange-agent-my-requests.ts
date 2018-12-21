import { Component } from '@angular/core';
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
export class ExchangeAgentMyRequestsPage {

  groupedExchangeList: ExchangeAgentOfferingGroup[];
  pendingTransactionList: Transaction[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer,
    private exchangeAgentOfferings: ExchangeAgentOfferingsService, private transactions: TransactionsService,
    private popoverCtrl: PopoverController, private modalCtrl: ModalController, private loading: LoadingUtil,
    private users: UsersService) {
    this.exchangeAgentOfferings.getGroupedExchangeAgentOfferings()
    .subscribe( results => {
      this.groupedExchangeList = results;
    });
  }

  refresh(){
    this.loading.show();
    this.transactions.find( new MyPendingTransactions() )
    .subscribe( results => {
      this.loading.hide();
      this.pendingTransactionList = results;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentMyRequestsPage');
  }

  ionViewWillEnter(){
    this.refresh();
  }

  getAvatarUrl(transaction: Transaction){
    if( transaction.person.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${transaction.person.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }

  goToRequestDetails(transaction: Transaction){
    if( this.canContinue( transaction ) ){
      this.navCtrl.push(CommonTransferToOtcPage,{
        transaction
      })
      return;
    }
    this.navCtrl.push( ExchangeAgentRequestDetailsPage, { 
      transaction
    });
  }

  openRequestOperations(transaction: Transaction, event){
    if( this.canContinue( transaction ) ){
      this.navCtrl.push(CommonTransferToOtcPage,{
        transaction
      })
      return;
    }
    let rejectAcceptPopover = this.popoverCtrl.create(RejectAcceptRequestPopoverComponent);
    rejectAcceptPopover.present({
      ev: event
    });
    rejectAcceptPopover.onDidDismiss( operation => {
      if( !operation ) return;
      if( operation == 'REJECT' ){
        this.onReject(transaction);
      }else if( operation == 'VIEW' ){
        this.navCtrl.push( ExchangeAgentRequestDetailsPage, { 
          transaction
        });
      }
    })
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
    return ( this.users.currentUser.userType == '0' && !!transaction.personBankAccount ) || 
      ( this.users.currentUser.userType == '1' && !!transaction.exchangeAgentBankAccount );
  }

}
