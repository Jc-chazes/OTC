import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  @Input() containerPage: { 
    ionViewWillEnter?: () => void, 
    ionViewWillLeave?: () => void,
    _ionViewWillEnter?: () => void, 
    _ionViewWillLeave?: () => void 
  };

  constructor(private users: UsersService, private events: EventsUtil) {
    this.blockEnabled = this.users.currentUser.isPerson()   
  }

  ngOnInit(){
    // if( this.blockEnabled ){
    //   this.lockHome();
    // }
    this.interceptContainerPageNavigationEvents();
  }

  ngOnDestroy(){
    // if( this.blockEnabled ){
    //   this.unlockHome();
    // }
  }

  interceptContainerPageNavigationEvents(){
    if( !this.containerPage ) return;
    let blockerInstance = this;
    let containerPage = this.containerPage;
    // if( !!this.containerPage.ionViewWillEnter ){
      this.containerPage._ionViewWillEnter = (this.containerPage.ionViewWillEnter || function(){}).bind(containerPage);
      this.containerPage.ionViewWillEnter = (function(){
        blockerInstance.lockHome();
        blockerInstance.containerPage._ionViewWillEnter();
      }).bind(this.containerPage);
    // }
    // if( !!this.containerPage.ionViewWillLeave ){
      this.containerPage._ionViewWillLeave = (this.containerPage.ionViewWillLeave || function(){}).bind(containerPage);
      this.containerPage.ionViewWillLeave = (function(){
        blockerInstance.unlockHome();
        blockerInstance.containerPage._ionViewWillLeave();
      }).bind(this.containerPage);
    // }
  }

  lockHome(){
    if( this.blockEnabled ){
      this.events.tabHomeIsEnabled.next(false);
    }
  }

  unlockHome(){
    if( this.blockEnabled ){
      this.events.tabHomeIsEnabled.next(true);
    }
  }

}
