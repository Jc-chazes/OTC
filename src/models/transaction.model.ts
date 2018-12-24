import { BaseModel } from "./base/base.model";
import { Image } from "./shared/image.model";
import { Person } from "./person.model";
import { ExchangeAgent } from "./exchange-agent.model";
import { ExchangeAgentOffering } from "./exchange-agent-offering.model";
import { Currency } from "./currency.model";
import { UserBankAccount } from "./user-bank-account.model";
import { padStart } from 'lodash';
import { Notification } from "./notification.model";

export class Transaction extends BaseModel<Transaction>{

    status: '0' | '1' | '2';
    amount: number;
    userTransactionImage: Image;
    exchangeAgentTransactionImage: Image;
    rejectionReason: string;
    person: Person;
    exchangeAgent: ExchangeAgent;
    exchangeAgentOffering: ExchangeAgentOffering;
    type: 'SAFE' | 'FAST';
    personBankAccount: UserBankAccount;
    exchangeAgentBankAccount: UserBankAccount;

    fromCurrency: Currency;
    targetCurrency: Currency;

    currencyToDeposit: Currency;
    currencyToReceive: Currency;

    amountToDeposit: number;
    amountToReceive: number;

    code: string;

    notifications: Notification[];

}