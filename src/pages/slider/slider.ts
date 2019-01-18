import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, App } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ChooseProfilePage } from '../choose-profile/choose-profile';

/**
 * Generated class for the SliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {

  sliders = [
    {
      text: 'El medio más <br> seguro',
      icon: '/assets/imgs/intro/shield.png',
      background: '/assets/imgs/intro/slider-1-bk.png'
    },
    {
      text: 'de Comprar y <br> Vender dinero',
      icon: '/assets/imgs/intro/money-bag.png',
      background: '/assets/imgs/intro/slider-2-bk.png'
    }
  ];

  currentSlider = 0;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SliderPage');
  }

  getBackgroundImage(slider){
    return this.sanitizer.bypassSecurityTrustStyle(`url(${slider.background})`);
  }

  onSlideChange(){
    this.currentSlider = this.slides.getActiveIndex();
    if( this.currentSlider > 1 ){
      this.currentSlider = 1;
    }
    if( this.currentSlider < 0 ){
      this.currentSlider = 0;
    }
  }

  close(){
    this.app.getRootNav().setRoot(ChooseProfilePage);
  }

}
