import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the RejectReasonSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reject-reason-select',
  templateUrl: 'reject-reason-select.html'
})
export class RejectReasonSelectComponent {

  reason: string = 'NO_FONDO';

  constructor(public viewCtrl: ViewController) {
  }

}
