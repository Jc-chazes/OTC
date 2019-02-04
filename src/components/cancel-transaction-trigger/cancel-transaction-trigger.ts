import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UsersService } from '../../providers/users.service';
import { TransactionsService } from '../../providers/transaction.service';
import { LoadingController } from 'ionic-angular';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { AuthProvider } from '../../providers/auth.service';
import { componentDestroyed } from '../../helpers/observable.helper';

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
export class CancelTransactionTriggerComponent implements OnDestroy{

  show = false;
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(private users: UsersService, private transactions: TransactionsService, private loading: LoadingUtil,
    private alerts: AlertUtil, private auth: AuthProvider) {
    this.users.currentUserChanges()
    .takeUntil( componentDestroyed(this) )
    .subscribe( currentUser => {
      // this.show = currentUser.isPerson();
      this.show = true
    })
  }

  ngOnDestroy(){

  }

  onCancel(){
    this.alerts.confirm('¿Está seguro de cancelar esta transacción?','Transacciones')
    .then( confirmed => {
      if( confirmed ){
        this.cancelTransaction();
      }
    })
  }

  cancelTransaction(){
    this.loading.show();
    this.transactions.cancelTransaction(
      this.users.currentUser.isPerson() ? 
        this.users.currentUser.person.currentTransaction :
        this.users.currentUser.exchangeAgent.currentTransaction 
    , this.users.currentUser.isPerson() ? 'PERSON' : 'EXCHANGE_AGENT' )
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
