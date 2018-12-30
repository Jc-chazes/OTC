import { BaseModel } from "./base/base.model";
import { User } from "./user.model";
import { Transaction } from "./transaction.model";
import { Contest } from "./contest.model";

export class Person extends BaseModel<Person>{

    firstName: String;
    lastName: String;
    birthdate: Date;
    documentNumber: string;
    businessName: string;
    ruc: string;
    cellphone: string;
    type: '0' | '1';
    user: User;
    currentTransaction: Transaction;
    currentContest: Contest;

    get fullName(): string{
        return this.firstName + ' ' + this.lastName;
    }

}