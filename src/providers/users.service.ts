import { BaseService } from "./base/base.service";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable, BehaviorSubject } from "rxjs";
import { ApiUtil } from "./utils/api.util";

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
}