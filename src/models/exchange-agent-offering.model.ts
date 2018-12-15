import { BaseModel } from "./base/base.model";
import { Currency } from "./currency.model";
import { BackupableModel } from "./contracts/backupable.model";

export class ExchangeAgentOffering extends BaseModel<ExchangeAgentOffering>{
    
    requestedCurrency: string;
    requestedCurrencyAmount: number;
    receivedCurrency: string;
    receivedCurrencyAmount: number;
    type: 'C' | 'V';
    active: boolean;

}