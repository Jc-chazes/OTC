import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Observable } from "rxjs";
import { Device } from '@ionic-native/device';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class DeviceUtil{

    constructor(private platform: Platform, private device: Device,  private firebaseNative: Firebase){

    }

    public getToken(): Observable<string>{
        return Observable.defer( async ()=> {
            let token = null;    
            try{
                if (this.platform.is('android')) {
                    token = await this.firebaseNative.getToken()
                } 
                if (this.platform.is('ios')) {
                    token = await this.firebaseNative.getToken();
                    const perm = await this.firebaseNative.grantPermission();
                } 
                if (!this.platform.is('cordova')) {
                }
            }catch(err){
                // alert(`Error obteniendo token: ${err}`);
            }
            return token;
        })
    }

    private isIos(){
        //return true;
        return this.platform.is('ios');
    }

}