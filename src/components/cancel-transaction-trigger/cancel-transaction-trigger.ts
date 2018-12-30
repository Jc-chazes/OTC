import { Component, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../providers/users.service';
import { TransactionsService } from '../../providers/transaction.service';
import { LoadingController } from 'ionic-angular';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { AuthProvider } from '../../providers/auth.service';

/**
 * Generated class for the CancelTransactionTriggerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cancel-transaction-trigger',
  templateUrl: 'cancel-transaction-trigger.html'
})
export class CancelTransactionTriggerComponent {

  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(private users: UsersService, private transactions: TransactionsService, private loading: LoadingUtil,
    private alerts: AlertUtil, private auth: AuthProvider) {
    
  }

  onCancel(){
    this.loading.show();
    this.transactions.cancelTransaction( this.users.currentUser.person.currentTransaction )
    .subscribe( couldCancel => {
      if( couldCancel ){
        // if( this.users.currentUser.isPerson() ){
        //   this.users.currentUser.person.currentTransaction = null; 
        // }else{
        //   this.users.currentUser.exchangeAgent.currentTransaction = null; 
        // }
        this.transactions.clearCurrentTransaction();
        this.cancel.emit();
        this.loading.hide();
      }else{
        this.alerts.show('No se pudo cancelar la transacción en curso','Cancelar transacción');
        this.loading.hide();
      }
    })
  }

}
