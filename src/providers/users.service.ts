import { BaseService } from "./base/base.service";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable, BehaviorSubject } from "rxjs";
import { ApiUtil } from "./utils/api.util";
import { Image } from "../models/shared/image.model";

@Injectable()
export class UsersService extends BaseService{

    constructor(api: ApiUtil){
        super(api);
    }

    private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    get currentUser(): User{
        return this._currentUser.value;
    }

    set currentUser(user: User){
        this._currentUser.next(user);
    }

    missingCurrenUserInfoFields(): string[]{
        const missingFields: string[] = [];
        if( !this.currentUser ){
            return [];
        }
        if( this.currentUser.isPerson() ){
            if( this.currentUser.person.type === '0' ){
                if( !this.currentUser.person.documentNumber ){
                    missingFields.push('documentNumber');
                }
            }else{
                if( !this.currentUser.person.ruc ){
                    missingFields.push('ruc');
                }
            }
            if( !this.currentUser.person.cellphone ){
                missingFields.push('cellphone');
            }
        }else{
            if( this.currentUser.exchangeAgent.type === '0' ){

            }else{
                
            }
            if( !this.currentUser.exchangeAgent.documentNumber ){
                missingFields.push('documentNumber');
            }
            if( !this.currentUser.exchangeAgent.phone ){
                missingFields.push('phone');
            }
        }
        return missingFields;
    }

    currentUserChanges(): Observable<User>{
        return this._currentUser.asObservable();
    }

    uploadPhoto(user: User, photo: Image): Observable<boolean>{
        let formData = new FormData();
        formData.append('files', photo.file, photo.name );
        formData.append('path','images');
        formData.append('refId',user.id.toString());
        formData.append('ref','user');
        formData.append('source','users-permissions');
        formData.append('field','photo');
        return this.api.post('/upload',formData)
        .map( resp => {
            return true;            
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    updatePhone(phone: string): Observable<boolean> {
        let url = '';
        let modifier = null;
        if( this.currentUser.isPerson() ){
            url = `/people/${this.currentUser.person.id}`;
            modifier = { cellphone: phone };
        }else{
            url = `/exchangeagents/${this.currentUser.exchangeAgent.id}`;
            modifier = { phone: phone };
        }
        return this.api.put(url,modifier)
        .map( resp => {
            return true;            
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    updateMissingFields( missingFields: { [missingFieldName: string]: any } ): Observable<boolean>{
        let url = '';
        if( this.currentUser.isPerson() ){
            url = `/people/${this.currentUser.person.id}`;
        }else{
            url = `/exchangeagents/${this.currentUser.exchangeAgent.id}`;
        }
        return this.api.put(url,missingFields)
        .map( resp => {
            return true;            
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }
}