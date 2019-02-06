import { Component, Injector } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TransactionsService } from '../../providers/transaction.service';
import { EventsUtil } from '../../providers/utils/events.util';

/**
 * Generated class for the YouHasBeenSelectedModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'you-has-been-selected-modal',
  templateUrl: 'you-has-been-selected-modal.html'
})
export class YouHasBeenSelectedModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController, public events: EventsUtil) {
  }

}
