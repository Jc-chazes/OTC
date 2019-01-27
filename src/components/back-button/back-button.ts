import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { popToIndex } from '../../helpers/nav-controller.helper';

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

  @Input() navCtrl: NavController;
  @Input() popToIndex: number;
  @Input() viewCtrl: ViewController;

  constructor() {
    
  }

  back(){
    if( !this.popToIndex ){
      this.navCtrl.pop()
    }else{
      // const parentIndex = this.viewCtrl.index;
      // for(let i = parentIndex; i > 0; i--){
      //     this.navCtrl.remove(i);
      // }
      popToIndex(this.navCtrl,this.viewCtrl,this.popToIndex);
    }
  }

}
