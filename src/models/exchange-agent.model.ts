import { BaseModel } from "./base/base.model";
import { User } from "./user.model";
import { ExchangeAgentOffering } from "./exchange-agent-offering.model";
import { Transaction } from "./transaction.model";

export class ExchangeAgent extends BaseModel<ExchangeAgent>{

    name: string;
    documentNumber: string;
    birthdate: Date;
    address: string;
    phone: string;
    sbsRegisterNumber: string;
    type: string;
    score: number;
    user: User;
    currentTransaction: Transaction;

    exchangeAgentOfferings: ExchangeAgentOffering[];
}