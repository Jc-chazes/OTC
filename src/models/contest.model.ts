import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";

export class Contest extends BaseModel<Contest>{

    exchangeAgents: ExchangeAgent[];

}