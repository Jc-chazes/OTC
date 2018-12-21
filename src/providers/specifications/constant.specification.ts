import { BaseSpecification } from "./base.specification";

export class ConstantSpecification extends BaseSpecification{

}

export class ConstantByCodeSpecification extends ConstantSpecification{
    constructor(public code: string){
        super();
    }
}