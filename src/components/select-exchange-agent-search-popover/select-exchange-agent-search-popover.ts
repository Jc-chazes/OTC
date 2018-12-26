import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the SelectExchangeAgentSearchPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'select-exchange-agent-search-popover',
  templateUrl: 'select-exchange-agent-search-popover.html'
})
export class SelectExchangeAgentSearchPopoverComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
    console.log('Hello SelectExchangeAgentSearchPopoverComponent Component');
    this.text = 'Hello World';
  }

}
