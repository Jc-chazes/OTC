import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { ExchangeAgentOffering } from "../models/exchange-agent-offering.model";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { MyExchangeAgentOfferings } from "./specifications/exchange-agent-offering.specification";
import { pick } from 'lodash';
import { CurrenciesService } from "./currencies.service";
import { Currency } from "../models/currency.model";
import { ExchangeAgentOfferingGroup } from "../models/exchang-agent-offering-group.model";

@Injectable()
export class ExchangeAgentOfferingsService extends BaseService implements CrudService<ExchangeAgentOffering>{

    constructor(api: ApiUtil, private users: UsersService, private currencies: CurrenciesService){
        super(api);
    }

    find(specification?: BaseSpecification): Observable<ExchangeAgentOffering[]> {
        if( specification instanceof MyExchangeAgentOfferings ){
            return this.api.get(`/exchangeagentofferings?exchangeAgent=${this.users.currentUser.exchangeAgent.id}&active=true`)
            .map( resp => {
                return resp.map( be => new ExchangeAgentOffering({ ...be }))
            })
            .catch( err => {
                console.warn('Error obteniendo sus tipos cambios')
                return Observable.of([]);
            });
        }
        return Observable.of([]);
    }    
    findOne(specification?: BaseSpecification): Observable<ExchangeAgentOffering> {
        throw new Error("Method not implemented.");
    }
    add(entity: ExchangeAgentOffering): Observable<ExchangeAgentOffering> {
        return this.api.post('/exchangeagentofferings',{
            ...pick(entity,['requestedCurrencyAmount','receivedCurrencyAmount','requestedCurrency','receivedCurrency','type']),
            active: true,
            exchangeAgent: this.users.currentUser.exchangeAgent.id
        }).map( resp => {
            return entity;
        }).catch( err => {
            console.warn('No se pudo crear el cambio: ', entity);
            return Observable.of(null);
        });
    }
    update(entity: ExchangeAgentOffering): Observable<ExchangeAgentOffering> {
        throw new Error("Method not implemented.");
    }
    remove(entity: ExchangeAgentOffering): Observable<ExchangeAgentOffering> {
        throw new Error("Method not implemented.");
    }

    getGroupedExchangeAgentOfferings(): Observable<ExchangeAgentOfferingGroup[]>{
        return Observable.forkJoin(
            this.currencies.find(),
            this.find( new MyExchangeAgentOfferings() )
        ).map( results => {
            let groupedExchangeAgentOfferingList: ExchangeAgentOfferingGroup[] = [];
            let currencyList = results[0];
            let exchangeAgentOfferingList = results[1];
            currencyList
            .filter( c => c.code != 'PEN' )
            .forEach( currency => {
              //Compra
              let buyExchange = exchangeAgentOfferingList.find( e => e.requestedCurrency == currency.code ) || new ExchangeAgentOffering({
                receivedCurrency: 'PEN',
                receivedCurrencyAmount: '0.0' as any,
                requestedCurrency: currency.code,
                requestedCurrencyAmount: 1,
                type: 'C',
                active: true
              });
              buyExchange.createBackup();
              //Venta
              let sellExchange = exchangeAgentOfferingList.find( e => e.receivedCurrency == currency.code ) || new ExchangeAgentOffering({
                requestedCurrency: 'PEN',
                requestedCurrencyAmount: '0.0' as any,
                receivedCurrency: currency.code,
                receivedCurrencyAmount: 1,
                type: 'V',
                active: true
              });
              sellExchange.createBackup();
              groupedExchangeAgentOfferingList.push( new ExchangeAgentOfferingGroup({ currency, exchanges: [buyExchange, sellExchange] }) );
            });
            return groupedExchangeAgentOfferingList;
        });
    }

    
}