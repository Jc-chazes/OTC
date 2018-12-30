import { UsersService } from "./users.service";
import { BaseService } from "./base/base.service";
import { Observable } from "rxjs";
import { ApiUtil } from "./utils/api.util";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Currency } from "../models/currency.model";
import { ExchangueAgentService } from "./exchange-agent.service";
import { SearchExchangeAgentSpecification } from "./specifications/exchange-agent.specification";

@Injectable()
export class ContestsService extends BaseService{

    constructor(private users: UsersService, api: ApiUtil, private firestore: AngularFirestore,
    private exchangeAgents: ExchangueAgentService){
        super(api);
    }

    createContest(contest: { currency: Currency, amount: number, operation: 'V' | 'C' }): Observable<{id:number}>{
        return this.exchangeAgents.search( new SearchExchangeAgentSpecification('','FAST',contest.operation,contest.currency,'precio',contest.amount) )
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