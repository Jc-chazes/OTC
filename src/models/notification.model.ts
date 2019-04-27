import { BaseModel } from "./base/base.model";
import { User } from "./user.model";
import { Transaction } from "./transaction.model";

export class Notification extends BaseModel<Notification>{

    title: string;
    content: string;
    groupType: 'TRANSACTION';
    type: string;
    user: User;
    transaction: Transaction;
    rejectionReason: string;

    timeLabel: { date: string, time: string };

    get icon(): string{
        return `http://157.230.229.87:85/static/imgs/icons/notification_${this.type.toLowerCase()}.png`;
    }
}