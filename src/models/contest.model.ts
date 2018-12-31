import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";
import { Currency } from "./currency.model";
import { Person } from "./person.model";

export class Contest extends BaseModel<Contest>{

    amount: number;
    active: boolean;
    operationType: 'V'|'C';
    targetCurrency: Currency;
    
    person: Person;
    selectedExchangeAgent: ExchangeAgent;
    exchangeAgents: ExchangeAgent[];
    

    participantsCounter: number;    

}