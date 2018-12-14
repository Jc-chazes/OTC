import { Injectable } from "@angular/core";
import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Bank } from "../models/bank.model";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Image } from "../models/shared/image.model";
import { getImageUrl } from "../helpers/images.helper";

@Injectable()
export class BanksService extends BaseService implements CrudService<Bank>{
    
    find(specification?: BaseSpecification): Observable<Bank[]> {
        return this.api.get('/banks')
        .map( resp => {
            return resp.map( be => new Bank({ ...be, image: new Image({ fileUrl: getImageUrl(be.image.url) }) }) );
        }).catch( err => {
            console.error(err);
            return Observable.of([]);
        });
    }    
    findOne(specification?: BaseSpecification): Observable<Bank> {
        throw new Error("Method not implemented.");
    }
    add(entity: Bank): Observable<Bank> {
        throw new Error("Method not implemented.");
    }
    update(entity: Bank): Observable<Bank> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Bank): Observable<Bank> {
        throw new Error("Method not implemented.");
    }


    

}