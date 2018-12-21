import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Image } from '../../models/shared/image.model';
import { DomSanitizer } from '@angular/platform-browser';
import { SuccessfulTransactionModalComponent } from '../../components/successful-transaction-modal/successful-transaction-modal';
import { Transaction } from '../../models/transaction.model';
import { ExchangeAgentMyRequestsPage } from '../exchange-agent-my-requests/exchange-agent-my-requests';
import { AlertUtil } from '../../providers/utils/alert.util';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { TransactionsService } from '../../providers/transaction.service';

/**
 * Generated class for the CommonSendVoucherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-send-voucher',
  templateUrl: 'common-send-voucher.html',
})
export class CommonSendVoucherPage {

  voucher: Image = new Image();
  voucherFileReader = new FileReader();
  transaction: Transaction;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alerts: AlertUtil,
    public sanitizer: DomSanitizer, private modalCtrl: ModalController, private loading: LoadingUtil,
    private transactions: TransactionsService) {
    this.transaction = this.navParams.get('transaction');
    this.voucherFileReader.onload = () => {
      this.voucher.fileUrl = this.voucherFileReader.result as string;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonSendVoucherPage');
  }

  voucherFileChange(event){
    let file = event.target.files[0];
    if(file){
      this.voucher.file = file;
      this.voucherFileReader.readAsDataURL(file);
    }
  }

  onSend(){
    if( !this.voucher.file ){
      this.alerts.show('Aún no has agregado la imagen','Enviar constancia');
      return;
    }
    this.loading.show();
    
    this.transactions.uploadVoucher( this.transaction, this.voucher )
    .subscribe( couldUpload => {
      this.loading.hide();
      if( couldUpload ){
        let successfulTransactionModal = this.modalCtrl.create(SuccessfulTransactionModalComponent,{
          transaction: this.transaction
        },{
          cssClass: 'alertModal successfulTransactionModal',
          enableBackdropDismiss: false
        });
        successfulTransactionModal.onDidDismiss( exit => {
          this.navCtrl.popTo( this.navCtrl.getByIndex(1) );
        });
        successfulTransactionModal.present();
      }
    })
  }

}
