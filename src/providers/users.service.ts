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
}