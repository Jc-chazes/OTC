import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Currency } from "../models/currency.model";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class CurrenciesService extends BaseService implements CrudService<Currency>{

    currencyList: Currency[];

    get currencyPEN(): Currency{
        return this.currencyList.find(  c => c.code == 'PEN' );
    }

    find(specification?: BaseSpecification): Observable<Currency[]> {
        if( !this.currencyList ){
            return this.api.get('/currencies')
            .map( resp => {
                this.currencyList = resp.map( be => new Currency({ ...be }) );
                return this.currencyList;
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }
        return Observable.of(this.currencyList);
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