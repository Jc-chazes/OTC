import { Component, Sanitizer } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Transaction } from '../../models/transaction.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsService } from '../../providers/constants.service';
import { Constant } from '../../models/constant.model';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';
import { AlertUtil } from '../../providers/utils/alert.util';
import { RejectWarningComponent } from '../../components/reject-warning/reject-warning';
import { ExchangeAgentSelectBankAccountPage } from '../exchange-agent-select-bank-account/exchange-agent-select-bank-account';
import { RejectReasonSelectComponent } from '../../components/reject-reason-select/reject-reason-select';

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
  private constants: ConstantsService, private alerts: AlertUtil, private modalCtrl: ModalController) {
    this.transaction = this.navParams.get('transaction');
    this.constants.findOne( new ConstantByCodeSpecification(`OTC_COMISSION_${this.transaction.exchangeAgentOffering.receivedCurrency}`) )
    .subscribe( result => {
      this.otcComission = result;
      this.otcComission.content = Number(this.otcComission.content);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangeAgentRequestDetailsPage');
  }

  get avatarUrl(){
    return this.sanitizer.bypassSecurityTrustStyle(`url('${this.transaction.person.user.photo.fileUrl}')`);
  }

  continue(){

  }

  reject(){
    let rejectModal = this.modalCtrl.create(RejectWarningComponent,{},{ showBackdrop: true, enableBackdropDismiss: true, cssClass: 'rejectWarningModal' });
    rejectModal.present();
    rejectModal.onDidDismiss( rejected => {
      if( rejected === true ){
        this.selectRejectReason();    
      }else if( rejected === false ){
        this.navCtrl.push( ExchangeAgentSelectBankAccountPage );
      }else{

      }
    });
  }

  selectRejectReason(){
    let rejectReasonSelectModal = this.modalCtrl.create(RejectReasonSelectComponent,{},{ showBackdrop: true, enableBackdropDismiss: true, cssClass: 'rejectReasonSelectModal' });
    rejectReasonSelectModal.present();
    rejectReasonSelectModal.onDidDismiss( reason => {
    });  
  }

}
