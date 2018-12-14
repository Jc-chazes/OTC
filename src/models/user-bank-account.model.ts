import { BaseModel } from "./base/base.model";
import { Currency } from "./currency.model";
import { Bank } from "./bank.model";
import { User } from "./user.model";

export class UserBankAccount extends BaseModel<UserBankAccount>{

    holderName: string;
    accountNumber: string;
    apellative: string;
    currency: Currency;
    bank: Bank;
    user: User;

}