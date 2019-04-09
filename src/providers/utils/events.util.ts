import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class EventsUtil{
    
    reloadPendingTransactions = new EventEmitter<any>();

    exchangeAgentRequestsIsShowing = new BehaviorSubject<boolean>(false);
    
    tabHomeIsEnabled = new BehaviorSubject<boolean>(true);
}