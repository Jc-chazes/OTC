import { AlertController, AlertButton, AlertOptions } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class AlertUtil{

    constructor(private alertCtrl: AlertController){

    }

    show(message: string, title: string, buttons: (string | AlertButton)[] = ['OK'], options: AlertOptions = {}){
        const alert = this.alertCtrl.create({
            ...options,
            title: title,
            subTitle: message,
            buttons: buttons
        });
        alert.present();
    }

}