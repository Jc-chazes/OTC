import { Component, Input, OnInit } from '@angular/core';
import { CurrenciesService } from '../../providers/currencies.service';
import { BanksService } from '../../providers/banks.service';
import { FormGroup } from '@angular/forms';
import { Bank } from '../../models/bank.model';
import { Currency } from '../../models/currency.model';

/**
 * Generated class for the CreateUserBankAccountFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-user-bank-account-form',
  templateUrl: 'create-user-bank-account-form.html'
})
export class CreateUserBankAccountFormComponent implements OnInit{

  @Input() userBankAccountFG: FormGroup;
  bankList: Bank[];
  currencyList: Currency[];
  currentBankIndex = 0;

  constructor(private banks: BanksService, private currencies: CurrenciesService) {
  }

  ngOnInit(){
    this.banks.find().subscribe( results => {
      this.bankList = results;
      this.userBankAccountFG.patchValue({
        bank: this.bankList[0]
      });
    });
    this.currencies.find().subscribe( results => {
      this.currencyList = results;
      this.userBankAccountFG.patchValue({
        currency: this.currencyList[0]
      });
    });
  }

  onPreviousBank(){
    if( this.currentBankIndex == 0 ){
      this.currentBankIndex = this.bankList.length - 1;
    }else {
      this.currentBankIndex--;
    }
    this.userBankAccountFG.patchValue({
      bank: this.bankList[this.currentBankIndex]
    });
  }

  onNextBank(){
    if( this.currentBankIndex == this.bankList.length - 1 ){
      this.currentBankIndex = 0;
    }else {
      this.currentBankIndex++;
    }
    this.userBankAccountFG.patchValue({
      bank: this.bankList[this.currentBankIndex]
    });
  }

}
