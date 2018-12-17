import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Transaction } from "../models/transaction.model";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { MyPendingTransactions } from "./specifications/transaction.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { HttpParams } from "@angular/common/http";
import { ExchangeAgent } from "../models/exchange-agent.model";
import { Person } from "../models/person.model";
import { ExchangeAgentOffering } from "../models/exchange-agent-offering.model";
import { CurrenciesService } from "./currencies.service";
import { TransactionMapper } from "./mappers/transaction.mapper";

@Injectable()
export class TransactionsService extends BaseService implements CrudService<Transaction>{

    mapper: TransactionMapper;

    constructor(api: ApiUtil, private users: UsersService, private currencies: CurrenciesService){
        super(api);
        this.mapper = new TransactionMapper(currencies);
    }

    find(specification?: BaseSpecification): Observable<Transaction[]> {
        if( specification instanceof MyPendingTransactions ){
            let params = new HttpParams();
            params = params.append('status','2');
            if( this.users.currentUser.userType == '0' ){
                params = params.append('person',this.users.currentUser.person.id.toString());
            }else{
                params = params.append('exchangeagent',this.users.currentUser.exchangeAgent.id.toString());
            }
            return this.api.get('/transactions',{
                params
            }).map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) );
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }
        throw new Error("Method not implemented.");
    }    
    findOne(specification?: BaseSpecification): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }
    add(entity: Transaction): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }
    update(entity: Transaction): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Transaction): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }


}