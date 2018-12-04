import { Component, OnInit, ViewChild } from '@angular/core';
import {NavController} from 'ionic-angular';
import { Login } from '../login/login';



@Component({
  selector: 'page-chooseLogin',
  templateUrl: './chooseLogin.html',
})
export class chooseLogin implements OnInit {
  profileType:any

  constructor(public nav : NavController) { }

  ngOnInit() {
    this.profileType ='';
  }

  registerClient(){
    this.profileType=0
  }
  registerHouseChangue(){
    this.profileType=1
  }
  checklogin(){
    this.nav.push(Login)
  }
}
