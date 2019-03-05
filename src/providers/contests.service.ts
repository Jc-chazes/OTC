import { UsersService } from "./users.service";
import { BaseService } from "./base/base.service";
import { Observable } from "rxjs";
import { ApiUtil } from "./utils/api.util";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Currency } from "../models/currency.model";
import { ExchangueAgentService } from "./exchange-agent.service";
import { SearchExchangeAgentSpecification } from "./specifications/exchange-agent.specification";
import { CrudService } from "./contracts/crud.service";
import { Contest } from "../models/contest.model";
import { BaseSpecification, ByIdSpecification } from './specifications/base.specification';
import { ExchangeAgentMapper } from "./mappers/exchange-agent.mapper";
import { ExchangeAgent } from "../models/exchange-agent.model";

@Injectable()
export class ContestsService extends BaseService implements CrudService<Contest>{

    exchangeAgentMapper = new ExchangeAgentMapper();

    constructor(private users: UsersService, api: ApiUtil, private firestore: AngularFirestore,
    private exchangeAgents: ExchangueAgentService){
        super(api);
    }

    find(specification?: BaseSpecification): Observable<Contest[]> {
        throw new Error("Method not implemented.");
    }

    findOne(specification?: BaseSpecification): Observable<Contest> {
        if( specification instanceof ByIdSpecification ){
            return this.api.get(`/contests/${specification.id}`)
            .map( resp => new Contest({ 
                ...resp,
                exchangeAgents: (resp.exchangeagents || []).map( ea => this.exchangeAgentMapper.mapFromBe(ea) )
            }) )
            .catch( err => {
                console.error(err);
                return Observable.of(null);
            })
        }
        throw new Error("Method not implemented.");
    }

    add(entity: Contest): Observable<Contest> {
        throw new Error("Method not implemented.");
    }

    update(entity: Contest): Observable<Contest> {
        throw new Error("Method not implemented.");
    }

    remove(entity: Contest): Observable<Contest> {
        throw new Error("Method not implemented.");
    }

    createContest(contest: { currency: Currency, amount: number, operation: 'V' | 'C' }): Observable<{id:number}>{
        return this.exchangeAgents.search( new SearchExchangeAgentSpecification('','FAST',contest.operation,contest.currency,null,'precio',contest.amount) )
        .map( (resp: {id:number}) => {
            return resp;
        })
        .catch( err => {
            console.error(err);
            return Observable.of(null);
        })
    }

    participateInContest(contestId){
        return this.api.post(`/contests/${contestId}/participate`,{
            exchangeAgent: this.users.currentUser.exchangeAgent.id
        })
        .map( resp => {
            return true;
        })
        .catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }
    
    selectWinner(contest: Contest, exchangeAgent: ExchangeAgent){
        return this.api.put(`/contests/${contest.id}`,{
            selectedExchangeagent: exchangeAgent.id,
            active: false
        })
        .map( resp => {
            return true;
        })
        .catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }

    contestChange(contestId): Observable<{ participantsCounter: number }>{
        return this.firestore.collection('contests').doc(String(contestId))
        .valueChanges().map( (contest: any) => {
            return {
                participantsCounter: contest.participantsCounter
            }
        })
    }

    cancelContest(contestId): Observable<boolean>{
        return this.api.put(`/contests/${contestId}`,{
            active: false
        })
        .map( resp => {
            return true;
        })
        .catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }

}