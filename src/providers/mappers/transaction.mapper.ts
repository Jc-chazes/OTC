import { BaseMapper } from "./base/base.mapper";
import { Transaction } from "../../models/transaction.model";
import { ExchangeAgent } from "../../models/exchange-agent.model";
import { Person } from "../../models/person.model";
import { ExchangeAgentOffering } from "../../models/exchange-agent-offering.model";
import { CurrenciesService } from "../currencies.service";
import { PersonMapper } from "./person.mapper";
import { UserBankAccount } from "../../models/user-bank-account.model";
import { UsersService } from "../users.service";
import moment from 'moment';
import { padStart } from 'lodash'
import { Image } from "../../models/shared/image.model";
import { getImageUrl } from "../../helpers/images.helper";
import { ExchangeAgentMapper } from "./exchange-agent.mapper";

export class TransactionMapper extends BaseMapper<Transaction>{

    type: new (partial?: Partial<Transaction>) => Transaction = Transaction;
    personMapper = new PersonMapper();
    exchangeAgentMapper = new ExchangeAgentMapper();

    constructor(private currencies: CurrenciesService, private users?: UsersService) {
        super();
    }

    mapFromBe(be): Transaction {
        delete be.code;
        let target = new Transaction({
            ...be,
            created_at: new Date(be.created_at),
            exchangeAgent: this.exchangeAgentMapper.mapFromBe(be.exchangeagent || be.exchangeAgent), //new ExchangeAgent({ ...(be.exchangeagent || be.exchangeAgent) }),
            person: this.personMapper.mapFromBe(be.person),
            exchangeAgentOffering: new ExchangeAgentOffering({ ...(be.exchangeagentoffering || be.exchangeAgentOffering) }),
            personBankAccount: be.personbankaccount ? new UserBankAccount({
                ...(be.personbankaccount || be.personBankAccount)
            }) : null,
            exchangeAgentBankAccount: be.exchangeagentbankaccount ? new UserBankAccount({
                ...(be.exchangeagentbankaccount || be.exchangeAgentBankAccount)
            }) : null,
            userTransactionImage: be.userTransactionImage ? new Image({
                fileUrl: getImageUrl(be.userTransactionImage)
            }) : null,
            exchangeAgentTransactionImage: be.exchangeAgentTransactionImage ? new Image({
                fileUrl: getImageUrl(be.exchangeAgentTransactionImage)
            }) : null
        })
        if (target.id) {
            target.code = `OTC-${(be.exchangeagentoffering || be.exchangeAgentOffering).type}${padStart(be.id.toString(), 6, '0')}`;
        }
        if (target.type == 'SAFE') {
            target.limitDate = moment(target.created_at).add(5, 'minutes').toDate();
        }
        if (this.users.currentUser.isPerson()) {
            target.currencyToDeposit = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.receivedCurrency);
            target.currencyToReceive = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.requestedCurrency);
            target.amountToDeposit = target.amount * target.exchangeAgentOffering.receivedCurrencyAmount;
            target.amountToReceive = target.amount * target.exchangeAgentOffering.requestedCurrencyAmount;
        } else {
            target.currencyToDeposit = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.requestedCurrency);
            target.currencyToReceive = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.receivedCurrency);
            target.amountToDeposit = target.amount * target.exchangeAgentOffering.requestedCurrencyAmount;
            target.amountToReceive = target.amount * target.exchangeAgentOffering.receivedCurrencyAmount;
        }
        if (target.exchangeAgentOffering.type == 'V') {
            target.targetCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.requestedCurrency);
            target.fromCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.receivedCurrency);
        } else {
            target.targetCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.receivedCurrency);
            target.fromCurrency = this.currencies.getCurrencyByCode(target.exchangeAgentOffering.requestedCurrency);
        }
        return target;
    }
}