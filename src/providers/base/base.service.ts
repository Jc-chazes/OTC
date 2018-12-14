import { Injectable } from "@angular/core";
import { ApiUtil } from "../utils/api.util";

@Injectable()
export class BaseService{
    
    constructor(protected api: ApiUtil){
        
    }

}