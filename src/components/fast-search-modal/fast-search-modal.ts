import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { componentDestroyed } from '../../helpers/observable.helper';
import { ContestsService } from '../../providers/contests.service';
import { NavParams, ViewController } from 'ionic-angular';
import { Contest } from '../../models/contest.model';
import { Constant } from '../../models/constant.model';
import { ConstantsService } from '../../providers/constants.service';
import { ConstantByCodeSpecification } from '../../providers/specifications/constant.specification';

/**
 * Generated class for the FastSearchModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fast-search-modal',
  templateUrl: 'fast-search-modal.html'
})
export class FastSearchModalComponent implements OnDestroy {

  otcFastSearchFirstTime: Constant;
  otcFastSearchSecondTime: Constant;
  toleranceTimeHasPassed = false;
  contest: Contest;

  constructor(private viewCtrl: ViewController,private contests: ContestsService, private navParams: NavParams,
  private constants: ConstantsService) {
    this.contest = new Contest({id:this.navParams.get('contest').id});
    Observable.forkJoin(      
      this.constants.findOne( new ConstantByCodeSpecification(`OTC_FAST_SEARCH_FIRST_TIME`) ),
      this.constants.findOne( new ConstantByCodeSpecification(`OTC_FAST_SEARCH_SECOND_TIME`) )
    ).subscribe( results => {
      this.otcFastSearchFirstTime = results[0];
      this.otcFastSearchSecondTime = results[0];
      this.contests.contestChange( this.contest.id )
        .takeUntil( componentDestroyed(this) )
        .subscribe( contest => {
          this.contest.participantsCounter = contest.participantsCounter;
          if( this.contest.participantsCounter >= 5 ){
            this.viewCtrl.dismiss(this.contest);
          }
        });
      Observable.of(null)
      // .delay( 1000 * 60 * 2 )
      .delay( Number(this.otcFastSearchFirstTime.content) * 1000 )
      .takeUntil( componentDestroyed(this) )
      .subscribe( () => {
        this.toleranceTimeHasPassed = true;
        Observable.of(null)
        // .delay( 1000 * 60 * 0.5 )
        .delay( Number(this.otcFastSearchSecondTime.content) * 1000 )
        .takeUntil( componentDestroyed(this) )
        .subscribe( () => {
          if( (this.contest.participantsCounter || 0) > 0 ){
            this.viewCtrl.dismiss(this.contest);
          }else{
            this.viewCtrl.dismiss(null);
          }
        })
      });
    });
  }

  ngOnDestroy(){

  }

}
