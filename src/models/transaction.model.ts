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

    id: number | any;
    status: '0' | '1' | '2' | '3';
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
    personaQuiereVoucherDelTipo: 'NINGUNO' | 'BOLETA' | 'FACTURA' = 'NINGUNO';
    agenteDeCambioQuiereVoucherDelTipo: 'NINGUNO' | 'BOLETA' | 'FACTURA' = 'NINGUNO';

    fromCurrency: Currency;
    targetCurrency: Currency;

    currencyToDeposit: Currency;
    currencyToReceive: Currency;

    amountToDeposit: number;
    amountToReceive: number;

    code: string;

    notifications: Notification[];

    limitDate: Date;

    agenteDeCambioDocumento: string;
    agenteDeCambioNombre: string;
    personaDocumento: string;
    personaNombre: string;
    personaCorreoReciboTransaccionDatos: string;
    agenteCambioCorreoReciboTransaccionDatos: string;

    amountToDepositToOTC(OTCComission: number){
        return (Number(OTCComission) + Number(this.amountToDeposit.toFixed(2))).toFixed(2);
    }

    get isExpired(): boolean{
        let remainingTime = this.limitDate.getTime() - (new Date()).getTime();
        return remainingTime < 0;
    }

}