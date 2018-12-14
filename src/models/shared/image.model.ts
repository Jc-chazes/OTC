import { BaseModel } from "../base/base.model";

export class Image extends BaseModel<Image>{

    name: string;
    file: Blob;
    fileUrl: string;

}