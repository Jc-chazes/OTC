import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { CommonViewProfilePage } from '../common-view-profile/common-view-profile';
import { UsersService } from '../../providers/users.service';
import { AuthProvider } from '../../providers/auth.service';
import { ChooseProfilePage } from '../choose-profile/choose-profile';
import { UsPage } from '../us/us';
import { LegalConditionsPage } from '../legal-conditions/legal-conditions';
import { ContactUsPage } from '../contact-us/contact-us';
import { StorageUtil, StorageKeys } from '../../providers/utils/storage.util';

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
    { name: 'Mi perfil', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_user.png', page: CommonViewProfilePage },
    { name: 'Nosotros', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_us.png', page: UsPage },
    { name: 'Condiciones legales', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_legal.png', page: LegalConditionsPage },
    { name: 'Contáctenos', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_contact.png', page: ContactUsPage },
    { name: 'www.otcperu.com.pe', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_web.png', page: null, href: 'http://otcperu.com.pe' },
    { name: '@otc.perú', icon: 'http://157.230.229.87:85/static/imgs/icons/profile_fb.png', page: null, href: 'https://www.facebook.com/OTC-PERU-948228435371020' }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider,
    private app: App, private users: UsersService, private storage: StorageUtil) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonMyProfilePage');
  }

  goToOption(option: { name: string, icon: string, page: any, href: string }){
    if( option.page ){
      this.navCtrl.push( option.page );
    }else if( option.href ){
      window.open(option.href, '_system', 'location=yes');
    }
  }

  logout(){
    this.auth.logout().subscribe(()=>{
      this.auth.purge();
      this.app.getRootNav().setRoot( ChooseProfilePage );
      this.storage.save(StorageKeys.SLIDER_HAS_BEEN_SHOWED,{ loaded: true });
    },err=>{alert(JSON.stringify(err))});
  }

}
