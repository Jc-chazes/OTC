import { Component, OnInit } from '@angular/core';
import { RegistrerAccountPage } from '../registrer-account/registrer-account';
import { NavController } from 'ionic-angular';
import { chooseLogin } from '../chooseLogin/chooseLogin';


@Component({
  selector: 'page-login',
  templateUrl: './login.html',

})
export class Login implements OnInit {

  constructor(public nvCtrl : NavController) { }

  ngOnInit() {
  }
  singUp(){

  }
  registrerUser(){
    this.nvCtrl.push(chooseLogin)
  }

}
