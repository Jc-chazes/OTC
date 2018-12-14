import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';

@Injectable()
export class UsersBankAccountsService extends BaseService implements CrudService<UserBankAccount>{

    find(specification?: BaseSpecification): Observable<UserBankAccount[]> {
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