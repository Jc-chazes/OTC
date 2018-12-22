import { BaseModel } from "./base/base.model";
import { User } from "./user.model";
import { Transaction } from "./transaction.model";

export class Notification extends BaseModel<Notification>{

    title: string;
    content: string;
    groupType: 'TRANSACTION';
    type: "ACCEPTED_BY_EXCHANGE_AGENT" | "OTC_DEPOSIT_RECEIVED" | "CHECK_YOUR_BANK_ACCOUNT" | "RECEIPT_SENT";
    user: User;
    transaction: Transaction;

    timeLabel: { date: string, time: string };
}