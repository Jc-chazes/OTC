import { BaseModel } from "./base/base.model";

export class Currency extends BaseModel<Currency>{

    name: string;
    code: string;
    symbol: string;

}