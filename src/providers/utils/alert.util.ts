import { AlertController, AlertButton } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class AlertUtil{

    constructor(private alertCtrl: AlertController){

    }

    show(message: string, title: string, buttons: (string | AlertButton)[] = ['OK'] ){
        const alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: buttons
        });
        alert.present();
    }

}