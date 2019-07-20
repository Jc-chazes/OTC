import { Injectable } from "@angular/core";
import { LoadingController, Loading } from "ionic-angular";

@Injectable()
export class LoadingUtil{

    loading: Loading;

    constructor(private loadingCtrl: LoadingController){
    }

    show(){
        this.loading = this.loadingCtrl.create()
        this.loading.present();        
    }

    hide(){
        return this.loading.dismiss();
    }

}