import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { ExchangeAgent } from "../models/exchange-agent.model";
import { SearchExchangeAgentSpecification } from "./specifications/exchange-agent.specification";
import { HttpParams } from "@angular/common/http";
import { ExchangeAgentMapper } from "./mappers/exchange-agent.mapper";
import { Person } from "../models/person.model";

@Injectable()
export class ExchangueAgentService extends BaseService implements CrudService<ExchangeAgent>{

    mapper: ExchangeAgentMapper = new ExchangeAgentMapper();
    
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
        throw new Error("Method not implemented.");
    }

    search( specification: SearchExchangeAgentSpecification ): Observable<ExchangeAgent[] | { id: number }>{
        let params = new HttpParams();
        if( specification.sortBy ){
            params = params.append('_sort',specification.sortBy);
        }
        if( specification.query ){
            params = params.append('name_contains',specification.query);
        }
        params = params.append('operation',specification.operation);
        params = params.append(specification.operation == 'V' ? 'receivedCurrency' : 'requestedCurrency',specification.targetCurrency.code);
        if( specification.searchMode == 'FAST' ){
            params = params.append('fast','1');
            params = params.append('amount',specification.amount.toString());
        }
        return this.api.get('/exchangeagents',{ params })
        .map( resp => {
            if( resp instanceof Array ){
                return resp.map( be => this.mapper.mapFromBe( be ) );
            }
            return resp;
        }).catch( err => {
            console.error(err);
            return Observable.of(null);
        })
    }

    addAscore(score: { person: Person, exchangeAgent: ExchangeAgent, score: number} ): Observable<boolean>{
        // alert(JSON.stringify({
        //     person: score.person.id,
        //     exchangeagent: score.exchangeAgent.id,
        //     score
        // }));
        return this.api.post('/exchangeagentscores',{
            person: score.person.id,
            exchangeagent: score.exchangeAgent.id,
            score: score.score
        }).map( resp => {
            return true;
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }
   


}