import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Constant } from "../models/constant.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { ConstantByCodeSpecification } from "./specifications/constant.specification";

@Injectable()
export class ConstantsService extends BaseService implements CrudService<Constant>{
    find(specification?: BaseSpecification): Observable<Constant[]> {
        throw new Error("Method not implemented.");
    }    
    findOne(specification?: BaseSpecification): Observable<Constant> {
        if( specification instanceof ConstantByCodeSpecification ){
            return this.api.get(`/constants?code=${specification.code}`)
            .map( resp => {
                return new Constant({ ...(resp[0] || {}) })
            })
            .catch( err => {
                console.error(err);
                return Observable.of(null);
            })
        }
        throw new Error("Method not implemented.");
    }
    findOneByCode(code: string): Observable<Constant>{
        return this.findOne( new ConstantByCodeSpecification(code) );
    }
    add(entity: Constant): Observable<Constant> {
        throw new Error("Method not implemented.");
    }
    update(entity: Constant): Observable<Constant> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Constant): Observable<Constant> {
        throw new Error("Method not implemented.");
    }


}