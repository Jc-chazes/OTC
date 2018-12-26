import { BaseMapper } from "./base/base.mapper";
import { ExchangeAgent } from "../../models/exchange-agent.model";
import { ExchangeAgentOffering } from "../../models/exchange-agent-offering.model";
import { UserMapper } from "./user.mapper";

export class ExchangeAgentMapper extends BaseMapper<ExchangeAgent>{
    
    userMapper = new UserMapper();
    type: new (partial?: Partial<ExchangeAgent>) => ExchangeAgent = ExchangeAgent;
    
    mapFromBe( be ): ExchangeAgent{
        let target = new ExchangeAgent({ 
            ...be,
            exchangeAgentOfferings: (be.exchangeagentofferings || []).map( eao => new ExchangeAgentOffering({ ...eao }) ),
            user: this.userMapper.mapFromBe(be.user)
        });
        return target;
    }

}