import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants.service';
import { Constant } from '../../models/constant.model';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  phone: Constant;

  constructor(public navCtrl: NavController, public navParams: NavParams, private constants : ConstantsService) {
    this.constants.findOne( new ConstantByCodeSpecification('OTC_CONTACT_PHONE') )
    .subscribe( result => {
      this.phone = result;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  get phoneForOrangeBox(){
    return this.phone && this.phone.content ? (this.phone.content as string).match(/.{1,3}/g).join(' ') : '';
  }

  get phoneForTelHref(){
    return this.phone && this.phone.content ? (this.phone.content as string).match(/.{1,3}/g).join('-') : '';
  }

}
