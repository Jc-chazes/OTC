import { BaseSpecification } from "./base.specification";
import { Currency } from "../../models/currency.model";

export class ExchangeAgentSpecification extends BaseSpecification{

}

export class SearchExchangeAgentSpecification extends ExchangeAgentSpecification{
    constructor(public query:string, public searchMode: 'FAST' | 'SAFE', public operation: 'V' | 'C', 
    public targetCurrency: Currency, public sortBy?: string, public amount?: number){
        super();
    }
}