import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ContentsService } from '../../providers/contents.service';
import { Content } from '../../models/content.model';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { ContentByCodeSpecification } from '../../providers/specifications/content.specification';

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
export class TermsAndConditionsModalComponent {

  termsAndConditions: Content;

  constructor(public viewCtrl: ViewController, private contents: ContentsService,
    private loading: LoadingUtil) {
    this.loading.show();
    this.contents.findOne( new ContentByCodeSpecification('TERMS_AND_CONDITIONS') )
    .subscribe( result => {
      this.loading.hide();
      this.termsAndConditions = result;
    })
  }

}
