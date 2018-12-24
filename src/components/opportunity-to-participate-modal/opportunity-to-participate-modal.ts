import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { CouldParticipateModalComponent } from '../could-participate-modal/could-participate-modal';
import { CouldNotParticipateModalComponent } from '../could-not-participate-modal/could-not-participate-modal';
import { ContestsService } from '../../providers/contests.service';

/**
 * Generated class for the OpportunityToParticipateModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'opportunity-to-participate-modal',
  templateUrl: 'opportunity-to-participate-modal.html'
})
export class OpportunityToParticipateModalComponent {

  participate = false;

  constructor(public viewCtrl: ViewController, public params: NavParams, private contests: ContestsService,
    private loading: LoadingUtil, private modalCtrl: ModalController) {
    
  }

  onParticipate(){
    this.loading.show();
    this.contests.participateInContest(this.params.get('contestId'))
    .subscribe( couldParticipate => {
      this.viewCtrl.dismiss(couldParticipate);
      this.loading.hide();
    })
  }
}
