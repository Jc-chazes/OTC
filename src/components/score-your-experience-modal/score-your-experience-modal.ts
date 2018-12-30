import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { range } from 'lodash';
import { Transaction } from '../../models/transaction.model';
import { ExchangueAgentService } from '../../providers/exchange-agent.service';

/**
 * Generated class for the ScoreYourExperienceModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'score-your-experience-modal',
  templateUrl: 'score-your-experience-modal.html'
})
export class ScoreYourExperienceModalComponent {

  score = 0;
  stars = range(5);
  transaction: Transaction;

  constructor(public viewCtrl: ViewController, private navParams: NavParams, private exchangeAgents: ExchangueAgentService) {
    this.transaction = navParams.get('transaction');    
  }

  send(){
    this.exchangeAgents.addAscore({
      person: this.transaction.person,
      exchangeAgent: this.transaction.exchangeAgent,
      score: this.score
    }).subscribe( resp => {
      this.viewCtrl.dismiss();
    })
  }

}
