import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
 
@Injectable()
export class DataService {
 
    exchange_agents: any; 
 
    constructor() {
 
        this.exchange_agents =[
    
            {"id": 1,
            "name": "dinjo cambista",
            "documentNumber": "12345678",
            "birthdate": "2018-12-07T00:00:00.000Z",
            "address": "asasa",
            "phone": "123456789",
            "sbsRegisterNumber": "asas11313",
            "user": null,
            "type": null,
            "score": 4,
            "created_at": "2018-12-15T17:01:53.000Z",
            "updated_at": "2018-12-15T17:01:53.000Z",
            "exchangeagentofferings": [
                {
                    "id": 2,
                    "requestedCurrencyAmount": 3.18,
                    "receivedCurrencyAmount": 1,
                    "type": "V",
                    "exchangeagent": 1,
                    "requestedCurrency": "PEN",
                    "receivedCurrency": "USD",
                    "active": true,
                    "created_at": "2018-12-15T18:08:44.000Z",
                    "updated_at": "2018-12-15T18:08:44.000Z"
                }
            ],
            "undefined": []
        },
        {"id": 2,
        "name": "dinjo cambista",
        "documentNumber": "12345678",
        "birthdate": "2018-12-07T00:00:00.000Z",
        "address": "asasa",
        "phone": "123456789",
        "sbsRegisterNumber": "asas11313",
        "user": null,
        "type": null,
        "score": 2,
        "created_at": "2018-12-15T17:01:53.000Z",
        "updated_at": "2018-12-15T17:01:53.000Z",
        "exchangeagentofferings": [
            {
                "id": 2,
                "requestedCurrencyAmount": 3.22,
                "receivedCurrencyAmount": 1,
                "type": "V",
                "exchangeagent": 1,
                "requestedCurrency": "PEN",
                "receivedCurrency": "USD",
                "active": true,
                "created_at": "2018-12-15T18:08:44.000Z",
                "updated_at": "2018-12-15T18:08:44.000Z"
            }
        ],
        "undefined": []
        },
        {"id": 3,
        "name": "Demo cambista",
        "documentNumber": "12345678",
        "birthdate": "2018-12-07T00:00:00.000Z",
        "address": "asasa",
        "phone": "123456789",
        "sbsRegisterNumber": "asas11313",
        "user": null,
        "type": null,
        "score": 5,
        "created_at": "2018-12-15T17:01:53.000Z",
        "updated_at": "2018-12-15T17:01:53.000Z",
        "exchangeagentofferings": [
            {
                "id": 3,
                "requestedCurrencyAmount": 3.58,
                "receivedCurrencyAmount": 1,
                "type": "V",
                "exchangeagent": 1,
                "requestedCurrency": "PEN",
                "receivedCurrency": "USD",
                "active": true,
                "created_at": "2018-12-15T18:08:44.000Z",
                "updated_at": "2018-12-15T18:08:44.000Z"
            }
        ],
        "undefined": []
        },
        {"id": 4,
        "name": "Ambar Dolar",
        "documentNumber": "12345678",
        "birthdate": "2018-12-07T00:00:00.000Z",
        "address": "asasa",
        "phone": "123456789",
        "sbsRegisterNumber": "asas11313",
        "user": null,
        "type": null,
        "score": 0,
        "created_at": "2018-12-15T17:01:53.000Z",
        "updated_at": "2018-12-15T17:01:53.000Z",
        "exchangeagentofferings": [
            {
                "id": 4,
                "requestedCurrencyAmount": 2.22,
                "receivedCurrencyAmount": 1,
                "type": "V",
                "exchangeagent": 1,
                "requestedCurrency": "PEN",
                "receivedCurrency": "USD",
                "active": true,
                "created_at": "2018-12-15T18:08:44.000Z",
                "updated_at": "2018-12-15T18:08:44.000Z"
            }
        ],
        "undefined": []
        }
          ]
 
    }
 
    filterItems(searchTerm){
        return this.exchange_agents.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ;
        });    
 
    }
 
}