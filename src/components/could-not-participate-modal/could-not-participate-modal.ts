import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the CouldNotParticipateModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'could-not-participate-modal',
  templateUrl: 'could-not-participate-modal.html'
})
export class CouldNotParticipateModalComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
  }

}
