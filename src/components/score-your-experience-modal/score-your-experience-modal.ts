import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello ScoreYourExperienceModalComponent Component');
    this.text = 'Hello World';
  }

}
