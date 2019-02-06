import { BaseModel } from "./base/base.model";
import { Image } from "./shared/image.model";

export class Bank extends BaseModel<Bank>{

    name: string;
    image: Image;
    accountNumberLength: number;
}