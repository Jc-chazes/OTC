import { UsersService } from "./users.service";
import { BaseService } from "./base/base.service";
import { Observable } from "rxjs";
import { ApiUtil } from "./utils/api.util";
import { Injectable } from "@angular/core";

@Injectable()
export class ContestsService extends BaseService{

    constructor(private users: UsersService, api: ApiUtil){
        super(api);
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

}