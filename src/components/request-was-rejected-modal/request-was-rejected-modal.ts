import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RequestWasRejectedModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'request-was-rejected-modal',
  templateUrl: 'request-was-rejected-modal.html'
})
export class RequestWasRejectedModalComponent {

  rejectionReason: string;
  rejectionReasonText: string;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.rejectionReason = params.get('rejectionReason');
    switch(this.rejectionReason){
      case 'NO_FONDO':
        this.rejectionReasonText = 'No cuenta son saldo suficiente'; break;
      case 'NO_DISPONIBLE':
        this.rejectionReasonText = 'No cuenta se encuentra disponible'; break;
      case 'NO_SE':
        this.rejectionReasonText = 'Razón desconocida'; break;
    }
  }

}
