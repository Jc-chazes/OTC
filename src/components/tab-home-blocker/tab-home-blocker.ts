import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../providers/users.service';
import { EventsUtil } from '../../providers/utils/events.util';

/**
 * Generated class for the TabHomeBlockerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tab-home-blocker',
  templateUrl: 'tab-home-blocker.html'
})
export class TabHomeBlockerComponent implements OnInit, OnDestroy {

  blockEnabled = false;

  constructor(private users: UsersService, private events: EventsUtil) {
    this.blockEnabled = this.users.currentUser.isPerson()   
  }

  ngOnInit(){
    if( this.blockEnabled ){
      this.events.tabHomeIsEnabled.next(false);
    }
  }

  ngOnDestroy(){
    if( this.blockEnabled ){
      this.events.tabHomeIsEnabled.next(false);
    }
  }

}
