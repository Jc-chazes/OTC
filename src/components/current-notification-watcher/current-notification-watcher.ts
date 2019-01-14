import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { UsersService } from '../../providers/users.service';
import { NavController } from 'ionic-angular';
import { TransactionsService } from '../../providers/transaction.service';
import { componentDestroyed } from '../../helpers/observable.helper';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { AuthProvider } from '../../providers/auth.service';

/**
 * Generated class for the CurrentNotificationWatcherComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'current-notification-watcher',
  templateUrl: 'current-notification-watcher.html'
})
export class CurrentNotificationWatcherComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  @Input() navCtrl: NavController;

  constructor(private users: UsersService, private transactions: TransactionsService,
  private auth: AuthProvider) {
    
  }

  ngOnInit(){
    this.auth.populate().subscribe( () => {
      this.transaction = this.users.currentUser.currentTransaction;
      this.transactions.transactionChange(this.transaction)
      .takeUntil( componentDestroyed(this) )
      .flatMap( tx => this.transactions.findOne(new ByIdSpecification(tx.id))  )
      .subscribe( tx => {
        if( tx ){
          if( tx.status == '0' ){
            this.transactions.clearCurrentTransaction();
            this.navCtrl.popToRoot();
          }
        }
      });
    });
  }

  ngOnDestroy(){
    
  }

}
