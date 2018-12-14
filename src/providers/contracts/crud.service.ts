import { BaseModel } from "../../models/base/base.model";
import { BaseSpecification } from "../specifications/base.specification";
import { Observable } from "rxjs";

export interface CrudService<T extends BaseModel<T>>{

    find( specification?: BaseSpecification ): Observable<T[]>;

    findOne( specification?: BaseSpecification ): Observable<T>;

    add( entity: T ): Observable<T>;

    update( entity: T ): Observable<T>;

    remove( entity: T ): Observable<T>;

}