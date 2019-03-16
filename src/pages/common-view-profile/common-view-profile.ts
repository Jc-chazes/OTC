import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth.service';
import { UsersService } from '../../providers/users.service';
import { Image } from '../../models/shared/image.model';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { CommonMyBankAccountsPage } from '../common-my-bank-accounts/common-my-bank-accounts';
import { User } from '../../models/user.model';

/**
 * Generated class for the CommonViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-view-profile',
  templateUrl: 'common-view-profile.html'
})
export class CommonViewProfilePage {

  name: string;
  document: string;
  address: string;
  phone: string;
  sbs: string;
  email: string;
  photo: Image;
  profileType: string;
  currentUser: User;
  editPhone: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService,
    private sanitizer: DomSanitizer, private loading: LoadingUtil, private alerts: AlertUtil, private auth: AuthProvider) {
    this.users.currentUserChanges().subscribe(  currentUser => {
      this.currentUser = currentUser;
      if( currentUser.isPerson() ){
        this.name = currentUser.person.fullName;
        this.document = currentUser.person.documentNumber;
        this.phone = currentUser.person.cellphone;
        this.profileType = currentUser.person.type == '0' ? 'Personal natural' : 'Persona jurídica'
      }else{
        this.name = currentUser.exchangeAgent.name;
        this.document = currentUser.exchangeAgent.documentNumber;
        this.address = currentUser.exchangeAgent.address;
        this.phone = currentUser.exchangeAgent.phone;
        this.sbs = currentUser.exchangeAgent.sbsRegisterNumber;
        this.profileType = currentUser.person.type == '0' ? 'Cambista' : 'Casa de cambio'
      }
      this.photo = currentUser.photo;
      this.email = currentUser.email;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonViewProfilePage');
  }
  
  getPhone(){
    if( this.currentUser.isPerson() ){
      return this.currentUser.person.cellphone;
    }else{
      return this.currentUser.exchangeAgent.phone;
    }
  }

  setPhone(phone){
    if( this.currentUser.isPerson() ){
      this.currentUser.person.cellphone = phone;
    }else{
      return this.currentUser.exchangeAgent.phone = phone ;
    }
  }

  
  get avatarUrl(): any{
    let url = '/assets/imgs/icons/profile_user.png';
    if( this.photo.fileUrl ){
      url = this.photo.fileUrl;
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url('${url}')`);
  };

  onChangePhoto(event){
    let file = event.target.files[0];
    if(file){
      this.loading.show();
      this.photo.file = file;
      this.users.uploadPhoto(this.users.currentUser,this.photo)
      .subscribe( result => {
        if(result){
          this.auth.populate().subscribe( () => {
            this.loading.hide();
          })
        }else{
          this.alerts.show('Su foto no pudo ser actualizada','Mi perfil');
          this.loading.hide();
        }
      })
    }
  }

  updatePhone(){
    // connect with back end
    this.loading.show();
    this.users.updatePhone(this.phone)
    .subscribe( couldUpdate => {
      this.editPhone = false;
      this.loading.hide();
      if( couldUpdate ){
        this.alerts.show('Teléfono actualizado','Mi perfil');
      }else{
        this.alerts.show('No se pudo actualizar su teléfono','Mi perfil');
        this.setPhone(this.getPhone());
      }
    })
  }

  goToMyBankAccounts(){
    this.navCtrl.push(CommonMyBankAccountsPage);
  }

}
