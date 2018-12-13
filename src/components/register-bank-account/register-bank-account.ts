import { Component } from '@angular/core';

/**
 * Generated class for the RegisterBankAccountComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'register-bank-account',
  templateUrl: 'register-bank-account.html'
})
export class RegisterBankAccountComponent {

  text: string;

  constructor() {
    console.log('Hello RegisterBankAccountComponent Component');
    this.text = 'Hello World';
  }

}
