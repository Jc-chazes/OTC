import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WaitYourRequestModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wait-your-request-modal',
  templateUrl: 'wait-your-request-modal.html'
})
export class WaitYourRequestModalComponent {

  text: string;
  isFastRequest: boolean;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.isFastRequest = navParams.get('isFastRequest');
  }

}
