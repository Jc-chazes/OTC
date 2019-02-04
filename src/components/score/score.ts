import { Component, Input } from '@angular/core';
import { range } from 'lodash';

/**
 * Generated class for the ScoreComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'score',
  templateUrl: 'score.html'
})
export class ScoreComponent {

  @Input('score') score: number;
  stars = range(5);

  constructor() {
  }

}
