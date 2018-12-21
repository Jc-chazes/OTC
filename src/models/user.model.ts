import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";
import { Person } from "./person.model";

export class User extends BaseModel<User>{
    username: string;
    email: string;
    password: string;
    userType: string;
    exchangeAgent: ExchangeAgent;
    person: Person;
}