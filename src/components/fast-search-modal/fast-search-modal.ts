import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { componentDestroyed } from '../../helpers/observable.helper';
import { ContestsService } from '../../providers/contests.service';
import { NavParams, ViewController } from 'ionic-angular';
import { Contest } from '../../models/contest.model';

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

  toleranceTimeHasPassed = false;
  contest: Contest;

  constructor(private viewCtrl: ViewController,private contests: ContestsService, private navParams: NavParams) {
    this.contest = new Contest({id:this.navParams.get('contest').id});
    this.contests.contestChange( this.contest.id )
    .takeUntil( componentDestroyed(this) )
    .subscribe( contest => {
      this.contest.participantsCounter = contest.participantsCounter;
      if( this.contest.participantsCounter >= 5 ){
        this.viewCtrl.dismiss(this.contest);
      }
    })
    Observable.of(null)
    .delay( 1000 * 60 * 2 )
    .takeUntil( componentDestroyed(this) )
    .subscribe( () => {
      this.toleranceTimeHasPassed = true;
      Observable.of(null)
      .delay( 1000 * 60 * 0.5 )
      .takeUntil( componentDestroyed(this) )
      .subscribe( () => {
        if( (this.contest.participantsCounter || 0) > 0 ){
          this.viewCtrl.dismiss(this.contest);
        }else{
          this.viewCtrl.dismiss(null);
        }
      })
    })
  }

  ngOnDestroy(){

  }

}
