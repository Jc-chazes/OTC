import { BaseModel } from "./base/base.model";
import { ExchangeAgent } from "./exchange-agent.model";
import { Person } from "./person.model";
import { Image } from "./shared/image.model";
import { Transaction } from "./transaction.model";

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

    get currentTransaction(): Transaction{
        if( this.isPerson() ){
            return this.person.currentTransaction;
        }else{
            return this.exchangeAgent.currentTransaction;
        }
    }

    set currentTransaction(value: Transaction){
        if( this.isPerson() ){
            this.person.currentTransaction = value;
        }else{
            this.exchangeAgent.currentTransaction = value;
        }
    }
}