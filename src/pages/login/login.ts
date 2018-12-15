import { Component, OnInit } from '@angular/core';
import { RegistrerAccountPage } from '../registrer-account/registrer-account';
import { NavController } from 'ionic-angular';
import { chooseLogin } from '../chooseLogin/chooseLogin';
import { AuthProvider } from '../../providers/auth.service';
import { User } from '../../models/user.model';
import { PersonTabsPage } from '../person-tabs/person-tabs';


@Component({
  selector: 'page-login',
  templateUrl: './login.html',

})
export class Login implements OnInit {

  showPassword = false;
  user = new User();

  constructor(public nvCtrl : NavController, private auth: AuthProvider) { }

  ngOnInit() {
  }

  login(){
    if( this.user.password && this.user.email ){
      this.auth.login(this.user).subscribe( results => {
        if(results){
          this.nvCtrl.push(PersonTabsPage)
        }
      })
    }
  }

}
