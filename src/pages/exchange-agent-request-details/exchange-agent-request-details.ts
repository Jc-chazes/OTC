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
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { ExchangueAgentService } from '../../providers/exchange-agent.service';
import { Observable } from 'rxjs';

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
  accepted = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
  private constants: ConstantsService, private alerts: AlertUtil, private modalCtrl: ModalController,
  private loading: LoadingUtil, private transactions: TransactionsService, private modals: ModalUtil,
  private exchangeAgents: ExchangueAgentService) {
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

  get isFast(){
    return this.transaction.type == 'FAST';
  }

  get isSafe(){
    return this.transaction.type == 'SAFE';
  }

  get avatarUrl(){
    if( this.transaction.person.user.photo ){
      return this.sanitizer.bypassSecurityTrustStyle(`url('${this.transaction.person.user.photo.fileUrl}')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('http://157.230.229.87:85/static/imgs/avatar_placeholder.png')`);
  }

  continue(){
    this.loading.show();
    Observable.forkJoin(
      this.transactions.acceptTransaction( this.transaction ),
      this.transactions.updateExact( this.transaction.id, {
        agenteCambioCorreoReciboTransaccionDatos: `|||${JSON.stringify( this.getAgenteCambioCorreoReciboTransaccionDatos() )}|||`
      })
    )
    .flatMap( () => {
      if( this.transaction.type == 'FAST' ){
        return this.exchangeAgents.updateCurrentTransaction(
          this.transaction.exchangeAgent.id,
          this.transaction.id);
      }else{
        return Observable.of(true);
      }
    })
    .subscribe( coudlBeAccepted => {
      //this.modals.openModal(this.modalCtrl,AvailableModals.RequestWasAcceptedModal)
      Promise.resolve()
      .then( () => {
        this.loading.hide();
        if( this.transaction.type == 'FAST' ){
          this.continueToNextSteps();
        }else{
          this.askForContinueOrBack();
        }
      })
    })
  }

  askForContinueOrBack(){
    this.modals.openModal(this.modalCtrl,AvailableModals.ContinueTransactionOrBackModal)
    .then( (selectedOption?: 'CONTINUE' | 'RETURN') => {
      if( !selectedOption || selectedOption == 'RETURN' ){
        this.navCtrl.pop();
      }else{
        this.continueToNextSteps();
      }
    });
  }

  continueToNextSteps(){
    this.accepted = true;
    this.transactions.setCurrentTransaction(this.transaction)    
    .subscribe()
    this.navCtrl.push( CommonSelectBankAccountPage,{
      transaction: this.transaction
    });
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

  timeHasEnded(){
    if( this.accepted ) return;
    this.alerts.show('Lo sentimos, esta transacción ya no es válida. Lo redirigiremos a la lista de sus solicitudes','Mis solicitudes')
    .then( () => {
      this.loading.show();
      setTimeout(()=>{
        this.loading.hide();
        this.navCtrl.pop();
      },300)
    });
  }

  get valorTipoCambio(){
    return this.transaction.exchangeAgentOffering.type == 'V' ? 
      this.transaction.exchangeAgentOffering.requestedCurrencyAmount : 
      this.transaction.exchangeAgentOffering.receivedCurrencyAmount
  }

  getAgenteCambioCorreoReciboTransaccionDatos(){
    return {
      enviaste: {
        bruto: this.transaction.amountToDeposit.toFixed(2),
        comision: this.otcComission.content
      },
      recibiras: (this.transaction.amountToReceive||0).toFixed(2),
      tipoDeCambio: this.valorTipoCambio,
      monedaSimbolo: {
        enviaste: this.transaction.currencyToDeposit.symbol,
        recibiras: this.transaction.currencyToReceive.symbol
      }
    }
  }
}
