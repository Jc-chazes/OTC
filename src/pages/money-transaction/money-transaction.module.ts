import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoneyTransactionPage } from './money-transaction';

@NgModule({
  declarations: [
    MoneyTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(MoneyTransactionPage),
  ],
})
export class MoneyTransactionPageModule {}
