import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the RejectAcceptRequestPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reject-accept-request-popover',
  templateUrl: 'reject-accept-request-popover.html'
})
export class RejectAcceptRequestPopoverComponent {

  constructor(public viewCtrl: ViewController) {
    
  }

  close(operation: string){
    this.viewCtrl.dismiss(operation);
  }

}
