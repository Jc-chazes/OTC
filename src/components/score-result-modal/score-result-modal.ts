import { Component } from '@angular/core';
import { range } from 'lodash';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ScoreResultModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'score-result-modal',
  templateUrl: 'score-result-modal.html'
})
export class ScoreResultModalComponent {

  score = 0;
  stars = range(5);
  personName: string = '';

  constructor(private navParams: NavParams, public viewCtrl: ViewController) {
    this.score = this.navParams.get('score');
    this.personName = this.navParams.get('personName');
  }

}
