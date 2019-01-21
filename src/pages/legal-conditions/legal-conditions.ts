import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContentsService } from '../../providers/contents.service';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { ContentByCodeSpecification } from '../../providers/specifications/content.specification';
import { getImageUrl } from '../../helpers/images.helper';

/**
 * Generated class for the LegalConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-legal-conditions',
  templateUrl: 'legal-conditions.html',
})
export class LegalConditionsPage {

  pdfSrc = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private contents: ContentsService,
    private loading: LoadingUtil) {
    this.loading.show();
    this.contents.findOne( new ContentByCodeSpecification('LEGAL_CONDITIONS') )
    .subscribe( result => {
      this.loading.hide();
      this.pdfSrc = getImageUrl(result.content);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LegalConditionsPage');
  }

}
