import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { ExchangeAgent } from "../models/exchange-agent.model";

@Injectable()
export class ExchangueAgentService extends BaseService implements CrudService<ExchangeAgent>{
    findOne(specification?: BaseSpecification): Observable<ExchangeAgent> {
        throw new Error("Method not implemented.");
    }
    add(entity: ExchangeAgent): Observable<ExchangeAgent> {
        throw new Error("Method not implemented.");
    }
    update(entity: ExchangeAgent): Observable<ExchangeAgent> {
        throw new Error("Method not implemented.");
    }
    remove(entity: ExchangeAgent): Observable<ExchangeAgent> {
        throw new Error("Method not implemented.");
    }

    find(specification?: BaseSpecification): Observable<ExchangeAgent[]> {
        return this.api.get('/banks')
        .map( resp => {
            return resp.map( be => console.log(be))
        }).catch( err => {
            console.error(err);
            return Observable.of([]);
        });
    }    
   


}