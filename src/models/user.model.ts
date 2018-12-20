import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";
import { Person } from "./person.model";
import { Image } from "./shared/image.model";

export class User extends BaseModel<User>{
    username: string;
    email: string;
    password: string;
    userType: string;
    exchangeAgent: ExchangeAgent;
    person: Person;
    photo: Image;

    isPerson(){
        return this.userType == '0';
    }

    isExchangeAgent(){
        return this.userType == '1';
    }
}