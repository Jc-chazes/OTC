import { BaseSpecification } from "./base.specification";
import { ExchangeAgent } from "../../models/exchange-agent.model";

export class ExchangeAgentOfferingSpecification extends BaseSpecification{

}

export class MyExchangeAgentOfferings extends ExchangeAgentOfferingSpecification{
    
    constructor(){
        super();
    }

}

export class ExchangeAgentOfferingsByExchangeAgent extends ExchangeAgentOfferingSpecification{
    
    constructor(public exchangeAgent: ExchangeAgent){
        super();
    }

}