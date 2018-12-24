import { BaseSpecification } from "./base.specification";

export class ContentSpecification extends BaseSpecification{

}

export class ContentByCodeSpecification extends ContentSpecification{
    constructor(public code: string){
        super();
    }
}