import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth.service';
import { UsersService } from '../../providers/users.service';
import { Image } from '../../models/shared/image.model';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { AlertUtil } from '../../providers/utils/alert.util';
import { CommonMyBankAccountsPage } from '../common-my-bank-accounts/common-my-bank-accounts';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private users: UsersService,
    private sanitizer: DomSanitizer, private loading: LoadingUtil, private alerts: AlertUtil, private auth: AuthProvider) {
    this.users.currentUserChanges().subscribe(  currentUser => {
      if( currentUser.isPerson() ){
        this.name = currentUser.person.fullName;
        this.document = currentUser.person.documentNumber;
        this.phone = currentUser.person.cellphone;
      }else{
        this.name = currentUser.exchangeAgent.name;
        this.document = currentUser.exchangeAgent.documentNumber;
        this.address = currentUser.exchangeAgent.address;
        this.phone = currentUser.exchangeAgent.phone;
        this.sbs = currentUser.exchangeAgent.sbsRegisterNumber;
      }
      this.photo = currentUser.photo;
      this.email = currentUser.email;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonViewProfilePage');
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

  goToMyBankAccounts(){
    this.navCtrl.push(CommonMyBankAccountsPage);
  }

}
