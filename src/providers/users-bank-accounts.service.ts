import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { MyBankAccountsSpecification, OtcBankAccountsSpecification } from "./specifications/user-bank-account.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { HttpParams } from "@angular/common/http";
import { omit } from 'lodash';
import { Bank } from "../models/bank.model";
import { Image } from "../models/shared/image.model";
import { getImageUrl } from "../helpers/images.helper";
import { UserBankAccountMapper } from "./mappers/user-bank-account.mapper";

@Injectable()
export class UsersBankAccountsService extends BaseService implements CrudService<UserBankAccount>{

    mapper = new UserBankAccountMapper();

    constructor(api: ApiUtil, private users: UsersService){
        super(api);
    }

    find(specification?: BaseSpecification): Observable<UserBankAccount[]> {
        if( specification instanceof MyBankAccountsSpecification ){
            return this.api.get('/userbankaccounts',{
                params: new HttpParams({ fromObject: { user: this.users.currentUser.id.toString() } })
            }).map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) );
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }
        if( specification instanceof OtcBankAccountsSpecification ){
            return this.api.get('/otcbankaccounts').map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) );
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
            ...omit( entity, ['currency','bank','type'] ),
            currency: entity.currency.id,
            bank: entity.bank.id,
            user: this.users.currentUser.id
        }).map( resp => {
            return new UserBankAccount({
                ...entity,
                id: resp.id
            });
        }).catch( err => {
            console.error(err);
            return Observable.of(null);
        })
    }
    update(entity: UserBankAccount): Observable<UserBankAccount> {
        throw new Error("Method not implemented.");
    }
    remove(entity: UserBankAccount): Observable<UserBankAccount> {
        return this.api.delete(`/userbankaccounts/${entity.id}`).map( resp => {
            return entity;
        }).catch( err => {
            console.error(err);
            return Observable.of(null);
        })
    }

    activateBankAccount(bankAccount: UserBankAccount): Observable<boolean>{
        return this.api.put(`/userbankaccounts/${bankAccount.id}`,{
            selected: true
        }).map( resp => {
            return true;
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }


}