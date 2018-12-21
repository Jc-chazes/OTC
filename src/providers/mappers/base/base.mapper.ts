export abstract class BaseMapper<T>{
    
    abstract type: new(partial?:Partial<T>) => T;

    mapFromBe(be:any): T{
        let defaultEntity = new this.type( be );
        return defaultEntity;
    }

    mapToBe(entity: T): any{
        let copyEntity = new this.type( entity );
        return copyEntity;
    }

}