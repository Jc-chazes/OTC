import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterChooseProfilePage } from '../register-choose-profile/register-choose-profile';
import { Login } from '../login/login';

/**
 * Generated class for the ChooseAccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-choose-access',
  templateUrl: 'choose-access.html',
})
export class ChooseAccessPage {

  constructor(public nvCtrl : NavController) { }

  ngOnInit() {
  }

  login(){
    this.nvCtrl.push(Login)
  }

  registerUser(){
    this.nvCtrl.push(RegisterChooseProfilePage)
  }

}
