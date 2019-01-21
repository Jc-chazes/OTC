import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ContentsService } from '../../providers/contents.service';
import { Content } from '../../models/content.model';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { ContentByCodeSpecification } from '../../providers/specifications/content.specification';
import { getImageUrl } from '../../helpers/images.helper';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the TermsAndConditionsModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'terms-and-conditions-modal',
  templateUrl: 'terms-and-conditions-modal.html'
})
export class TermsAndConditionsModalComponent implements OnDestroy {

  termsAndConditions: Content;
  pdfSrc = null;
  showing = true;

  constructor(public viewCtrl: ViewController, private contents: ContentsService,
    private loading: LoadingUtil, private sanitizer: DomSanitizer) {
    this.loading.show();
    this.contents.findOne( new ContentByCodeSpecification('TERMS_AND_CONDITIONS') )
    .subscribe( result => {
      this.loading.hide();
      this.pdfSrc =  getImageUrl(result.content);
    })
  }

  ngOnDestroy(){
    this.showing = false;
  }

}
