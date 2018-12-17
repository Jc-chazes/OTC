import { BaseMapper } from "./base/base.mapper";
import { Transaction } from "../../models/transaction.model";
import { ExchangeAgent } from "../../models/exchange-agent.model";
import { Person } from "../../models/person.model";
import { ExchangeAgentOffering } from "../../models/exchange-agent-offering.model";
import { CurrenciesService } from "../currencies.service";

export class TransactionMapper extends BaseMapper<Transaction>{

    type: new (partial?: Partial<Transaction>) => Transaction = Transaction;
    
    constructor(private currencies: CurrenciesService){
        super();
    }

    mapFromBe(be) :Transaction{
        let target = new Transaction({
            ...be,
            created_at: new Date(be.created_at),
            exchangeAgent: new ExchangeAgent({ ...be.exchangeagent }),
            person: new Person({ ...be.person }),
            exchangeAgentOffering: new ExchangeAgentOffering({ ...be.exchangeagentoffering })
        })
        if( target.exchangeAgentOffering.type == 'V' ){
            target.targetCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.receivedCurrency);
        }else{
            target.targetCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.requestedCurrency);
        }
        return target;
    }
}