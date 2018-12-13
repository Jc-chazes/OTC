import { BaseModel } from "./base/base.model";

export class User extends BaseModel<User>{
    username: string;
    email: string;
    password: string;
    userType: string;
}