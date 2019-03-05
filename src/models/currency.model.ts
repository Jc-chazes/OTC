import { BaseModel } from "./base/base.model";
import { Image } from "./shared/image.model";

export class Currency extends BaseModel<Currency>{

    name: string;
    code: string;
    symbol: string;
    image: Image;

}