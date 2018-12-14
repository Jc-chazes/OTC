import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Currency } from "../models/currency.model";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class CurrenciesService extends BaseService implements CrudService<Currency>{

    find(specification?: BaseSpecification): Observable<Currency[]> {
        return this.api.get('/currencies')
        .map( resp => {
            return resp.map( be => new Currency({ ...be }) );
        }).catch( err => {
            console.error(err);
            return Observable.of([]);
        });        
    }    
    findOne(specification?: BaseSpecification): Observable<Currency> {
        throw new Error("Method not implemented.");
    }
    add(entity: Currency): Observable<Currency> {
        throw new Error("Method not implemented.");
    }
    update(entity: Currency): Observable<Currency> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Currency): Observable<Currency> {
        throw new Error("Method not implemented.");
    }


}