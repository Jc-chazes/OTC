import { Component, Sanitizer } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Transaction } from '../../models/transaction.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsService } from '../../providers/constants.service';
import { Constant } from '../../models/constant.model';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';
import { AlertUtil } from '../../providers/utils/alert.util';
import { RejectWarningComponent } from '../../components/reject-warning/reject-warning';
import { RejectReasonSelectComponent } from '../../components/reject-reason-select/reject-reason-select';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { TransactionsService } from '../../providers/transaction.service';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';

/**
 * Generated class for the ExchangeAgentRequestDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-exchange-agent-request-details',
  templateUrl: 'exchange-agent-request-details.html',
})
export class ExchangeAgentRequestDetailsPage {

  transaction: Transaction;
  otcComission: Constant = new Constant({ content: 0 });

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
  private constants: ConstantsService, private alerts: AlertUtil, private modalCtrl: ModalController,
  private loading: LoadingUtil, private transactions: TransactionsService) {
    this.transaction = this.navParams.get('transaction');
    this.constants.findOne( new ConstantByCodeSpecification(`OTC_COMISSION_${this.transaction.exchangeAgentOffering.requestedCurrency}`) )
    .subscribe( result => {
      this.otcComission = result;
      this.otcComission.content = Number(this.otcComission.content);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentRequestDetailsPage');
  }

  get avatarUrl(){
    if( this.transaction.person.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${this.transaction.person.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('/assets/imgs/avatar_placeholder.png')`);
  }

  continue(){
    this.loading.show();
    this.transactions.acceptTransaction( this.transaction )
    .subscribe( coudlBeAccepted => {
      this.loading.hide();
      this.transactions.setCurrentTransaction(this.transaction)
      .subscribe()
      this.navCtrl.push( CommonSelectBankAccountPage,{
        transaction: this.transaction
      });
    })
  }

  reject(){
    let rejectModal = this.modalCtrl.create(RejectWarningComponent,{},{ showBackdrop: true, enableBackdropDismiss: true, cssClass: 'rejectWarningModal' });
    rejectModal.present();
    rejectModal.onDidDismiss( rejected => {
      if( rejected === true ){
        this.selectRejectReason( this.transaction );    
      }else if( rejected === false ){
        this.continue();
      }else{

      }
    });
  }

  selectRejectReason(transaction){
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
            this.navCtrl.pop();
          }
        })
      }
    });  
  }

}
