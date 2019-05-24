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
  exchangeAgentType: '0' | '1';
  cancelledBy: 'EXCHANGE_AGENT' | 'PERSON';
  rechazadaCancelada: 'RECHAZADA' | 'CANCELADA';

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.rejectionReason = params.get('rejectionReason');
    this.cancelledBy = params.get('cancelledBy');
    this.exchangeAgentType = params.get('exchangeAgentType');
    this.rechazadaCancelada = params.get('rechazadaCancelada');
    switch(this.rejectionReason){
      case 'NO_FONDO':
        this.rejectionReasonText = 'No cuenta con saldo suficiente'; break;
      case 'NO_DISPONIBLE':
        this.rejectionReasonText = 'No se encuentra disponible'; break;
      case 'NO_SE':
        this.rejectionReasonText = 'Razón desconocida'; break;
    }
  }

}
