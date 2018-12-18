import { BaseModel } from "./base/base.model";
import { User } from "./user.model";

export class Person extends BaseModel<Person>{

    firstName: String;
    lastName: String;
    birthdate: Date;
    docuementNumber: string;
    businessName: string;
    ruc: string;
    cellphone: string;
    type: '0' | '1';
    user: User;

    get fullName(): string{
        return this.firstName + ' ' + this.lastName;
    }

}