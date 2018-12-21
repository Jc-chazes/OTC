import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Image } from '../../models/shared/image.model';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public sanitizer: DomSanitizer) {
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

}
