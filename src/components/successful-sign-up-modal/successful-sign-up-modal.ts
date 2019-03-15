import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'successful-sign-up-modal',
  templateUrl: 'successful-sign-up-modal.html'
})
export class SuccessfulSignUpModalComponent {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {}

}
