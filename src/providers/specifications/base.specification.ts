export class BaseSpecification{
}

export class ByIdSpecification extends BaseSpecification{
    constructor(public id: number){
        super();
    }
}