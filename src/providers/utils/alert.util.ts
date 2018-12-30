import { AlertController, AlertButton, AlertOptions } from "ionic-angular";
import { Injectable, NgZone } from "@angular/core";

@Injectable()
export class AlertUtil{

    constructor(private alertCtrl: AlertController, private ngZone: NgZone){

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

    confirm(message: string, title: string): Promise<boolean>{
        return new Promise((resolve,reject)=>{
            const alert = this.alertCtrl.create({
                title: title,
                subTitle: message,
                buttons: [
                    {
                      text: 'No',
                      handler: () => {
                        this.ngZone.run(()=>resolve(false));
                      }
                    },
                    {
                      text: 'Sí',
                      handler: () => {
                        this.ngZone.run(()=>resolve(true));
                      }
                    }
                  ]
            });
            alert.present();      
        })
    }

}