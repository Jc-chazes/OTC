export class BaseModel<T>{

    id: number;

    constructor(partial? :Partial<T>){
        Object.assign(this,partial);
    }

}