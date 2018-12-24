import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Content } from "../models/content.model";
import { Injectable } from "@angular/core";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { ContentByCodeSpecification } from "./specifications/content.specification";

@Injectable()
export class ContentsService extends BaseService implements CrudService<Content>{
    find(specification?: BaseSpecification): Observable<Content[]> {
        throw new Error("Method not implemented.");
    }    
    findOne(specification?: BaseSpecification): Observable<Content> {
        if( specification instanceof ContentByCodeSpecification ){
            return this.api.get(`/contents?code=${specification.code}`)
            .map( resp => {
                return new Content({ ...(resp[0] || {}) })
            })
            .catch( err => {
                console.error(err);
                return Observable.of(null);
            })
        }
        throw new Error("Method not implemented.");
    }
    add(entity: Content): Observable<Content> {
        throw new Error("Method not implemented.");
    }
    update(entity: Content): Observable<Content> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Content): Observable<Content> {
        throw new Error("Method not implemented.");
    }


}