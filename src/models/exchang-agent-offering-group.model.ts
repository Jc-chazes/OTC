import { BaseModel } from "./base/base.model";
import { Currency } from "./currency.model";
import { ExchangeAgentOffering } from "./exchange-agent-offering.model";

export class ExchangeAgentOfferingGroup extends BaseModel<ExchangeAgentOfferingGroup>{

    currency: Currency;
    fromCurrency: Currency = new Currency({ symbol: 'S/.' }); 
    exchanges: ExchangeAgentOffering[];

    get buyExchange(){
        return this.exchanges.find( ex => ex.type == 'C' );
    }

    get sellExchange(){
        return this.exchanges.find( ex => ex.type == 'V' );
    }

}