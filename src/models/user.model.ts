import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";

export class User extends BaseModel<User>{
    username: string;
    email: string;
    password: string;
    userType: string;
    exchangeAgent: ExchangeAgent;
}