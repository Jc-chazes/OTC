import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddBankPage } from './add-bank/add-bank';
import { FormGroup ,FormControl,Validators} from '@angular/forms';
import { AuthProvider } from '../../providers/auth.service';
import { QuotePage } from '../quote/quote';

@Component({
  selector: 'page-registrer-account',
  templateUrl: 'registrer-account.html',
})
export class RegistrerAccountPage {
  show:number;
  checkButton:number;
  formu : FormGroup;
  formuLegal : FormGroup;
  body : {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public auth : AuthProvider) {
    this.checkButton = 0
   
  }

  ionViewWillLoad() {
    this.formu = new FormGroup({
      'firstName' : new FormControl(),
      'lastName' :  new FormControl(),
      'birthdate' : new FormControl(),
      'documentNumber' : new FormControl(),
      'cellphone' : new FormControl(),
      'email': new FormControl(),
      'password' : new FormControl(),
    })
    this.formuLegal = new FormGroup({
      'businessName' : new FormControl(),
      'ruc': new FormControl(),
      'cellphone' : new FormControl(),
      'email': new FormControl(),
      'password' : new FormControl(),
    })
  }
  showHide(){
    this.show = 1 
  }

  clickUser(numb){
    console.log(numb)
    this.checkButton = numb
  }
  
  addBank(){
    this.navCtrl.push(AddBankPage)
  }
  submit(){
    let body = {
      "username":"otc",
      "email":this.formu.value.email,
      "password":this.formu.value.password,
      "userType":"0",
      "profile":{
        "firstName":this.formu.value.firstName,
        "lastName":this.formu.value.lastName,
        "birthdate":this.formu.value.birthdate,
        "documentNumber":this.formu.value.documentNumber,
        "businessName":"",
        "ruc":"",
        "cellphone":"",
        "type":this.checkButton,
        }
    }
    // this.auth.registrerUser(body).subscribe(res =>{
    //     this.validateAnswer(res)
    // })
    this.navCtrl.push(QuotePage)

    console.log(this.formu.value)
  }
  submitLegal(){
    let body = {
      "username":"otc",
      "email":this.formu.value.email,
      "password":this.formu.value.password,
      "userType":"0",
      "profile":{
        "firstName":"",
        "lastName":"",
        "birthdate":"",
        "documentNumber":"",
        "businessName":this.formuLegal.value.businessName,
        "ruc":this.formuLegal.value.ruc,
        "cellphone":this.formuLegal.value.cellphone,
        "type":this.checkButton,
        }
    }
    this.auth.registrerUser(body).subscribe(res =>{
      this.validateAnswer(res)
    })
    console.log(this.formuLegal.value)
  }
  validateAnswer(data){
    if (data.jwt){
      localStorage.setItem('token',data.jwt)
    }
  }
}
