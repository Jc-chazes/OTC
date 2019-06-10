import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient,HttpHeaders} from '@angular/common/http'
 
@Injectable()
export class DataService {
 
    
    exchange_agents:any
    constructor(private http:HttpClient) {
 
      
    }

    
 
    getDataExchangueAgents(){
        const headers = new HttpHeaders({
            'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlclR5cGUiOiIwIiwiaWF0IjoxNTQ1NTgwNDUyLCJleHAiOjE1NDgxNzI0NTJ9.6SrCkHv1Wm0BLv2yTiQGY3SVMtNVZix_FNpQwSkpe_s'
        })
        return this.http.get('https://backend.otcperu.com.pe/exchangeagents?_sort=precio&requestedCurrency=PEN&operation=C',{headers})
       
    }
 
}