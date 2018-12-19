import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { MyBankAccountsSpecification } from "./specifications/user-bank-account.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class UsersBankAccountsService extends BaseService implements CrudService<UserBankAccount>{

    constructor(api: ApiUtil, private users: UsersService){
        super(api);
    }

    find(specification?: BaseSpecification): Observable<UserBankAccount[]> {
        if( specification instanceof MyBankAccountsSpecification ){
            return this.api.get('/userbankaccounts',{
                params: new HttpParams({ fromObject: { user: this.users.currentUser.id.toString() } })
            }).map( resp => {
                return resp.map( be => new UserBankAccount({ ...be }));
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }
        throw new Error("Method not implemented.");
    }    
    findOne(specification?: BaseSpecification): Observable<UserBankAccount> {
        throw new Error("Method not implemented.");
    }
    add(entity: UserBankAccount): Observable<UserBankAccount> {
        return this.api.post('/userbankaccounts',{
            ...entity,
            currency: entity.currency.id,
            bank: entity.bank.id
        }).map( resp => {
            return entity;
        }).catch( err => {
            console.error(err);
            return Observable.of(null);
        })
    }
    update(entity: UserBankAccount): Observable<UserBankAccount> {
        throw new Error("Method not implemented.");
    }
    remove(entity: UserBankAccount): Observable<UserBankAccount> {
        throw new Error("Method not implemented.");
    }


}