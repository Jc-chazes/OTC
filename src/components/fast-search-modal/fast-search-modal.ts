import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { componentDestroyed } from '../../helpers/observable.helper';
import { ContestsService } from '../../providers/contests.service';
import { NavParams } from 'ionic-angular';

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

  constructor(private contests: ContestsService, private navParams: NavParams) {
    this.contests.contestChange( this.navParams.get('contest').id )
    .takeUntil( componentDestroyed(this) )
    .subscribe( contest => {
      console.log(contest);
    })
    Observable.of(null)
    .delay( 1000 * 6/*0 * 2.5 */ )
    .takeUntil( componentDestroyed(this) )
    .subscribe( () => {
      this.toleranceTimeHasPassed = true;
      Observable.of(null)
      .delay(1000*3)
      .subscribe( () => {
      
      })
    })
  }

  ngOnDestroy(){

  }

}
