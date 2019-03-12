import { BaseModel } from "./base/base.model";
import { Currency } from "./currency.model";
import { Bank } from "./bank.model";
import { User } from "./user.model";
import { BankAccountTypes } from "../settings/enums.settings";

export class UserBankAccount extends BaseModel<UserBankAccount>{

    holderName: string;
    accountNumber: string;
    apellative: string;
    currency: Currency;
    bank: Bank;
    user: User;
    accountType: string;
    selected: boolean;

    formattedAccountType(): string{
        return BankAccountTypes.find( t => t.code == this.accountType ).text;
    }
}

export class OtcBankAccount extends UserBankAccount{

    informacionAdicional: string;

}