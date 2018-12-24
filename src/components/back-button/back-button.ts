import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the BackButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'back-button',
  templateUrl: 'back-button.html'
})
export class BackButtonComponent {

  @Input()navCtrl: NavController;

  constructor() {
    
  }

}
