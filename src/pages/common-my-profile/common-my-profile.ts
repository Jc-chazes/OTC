import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { CommonViewProfilePage } from '../common-view-profile/common-view-profile';
import { UsersService } from '../../providers/users.service';
import { AuthProvider } from '../../providers/auth.service';
import { ChooseProfilePage } from '../choose-profile/choose-profile';

/**
 * Generated class for the CommonMyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-common-my-profile',
  templateUrl: 'common-my-profile.html',
})
export class CommonMyProfilePage {

  options = [
    { name: 'Mi perfil', icon: '/assets/imgs/icons/profile_user.png', page: CommonViewProfilePage },
    { name: 'Nosotros', icon: '/assets/imgs/icons/profile_us.png', page: CommonViewProfilePage },
    { name: 'Condiciones legales', icon: '/assets/imgs/icons/profile_legal.png', page: CommonViewProfilePage },
    { name: 'Contáctenos', icon: '/assets/imgs/icons/profile_contact.png', page: CommonViewProfilePage },
    { name: 'www.otc.com', icon: '/assets/imgs/icons/profile_web.png', page: CommonViewProfilePage },
    { name: '@otc.perú', icon: '/assets/imgs/icons/profile_fb.png', page: CommonViewProfilePage }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider,
    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyProfilePage');
  }

  goToOption(option: { name: string, icon: string, page: any }){
    this.navCtrl.push( option.page );
  }

  logout(){
    this.auth.purge();
    this.app.getRootNav().setRoot( ChooseProfilePage );
  }

}
