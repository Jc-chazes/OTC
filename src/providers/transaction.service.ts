import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { Transaction } from "../models/transaction.model";
import { BaseSpecification, ByIdSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable, NgZone, EventEmitter } from "@angular/core";
import { MyPendingTransactions } from "./specifications/transaction.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { ExchangeAgent } from "../models/exchange-agent.model";
import { Person } from "../models/person.model";
import { ExchangeAgentOffering } from "../models/exchange-agent-offering.model";
import { CurrenciesService } from "./currencies.service";
import { TransactionMapper } from "./mappers/transaction.mapper";
import { UserBankAccount } from "../models/user-bank-account.model";
import { Image } from "../models/shared/image.model";
import moment from 'moment';
import { groupBy } from 'lodash';
import { Firebase } from "@ionic-native/firebase";
import { Platform, ModalController } from "ionic-angular";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ModalUtil, AvailableModals } from "./utils/modal.util";
import { Currency } from "../models/currency.model";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class TransactionsService extends BaseService implements CrudService<Transaction>{

    mapper: TransactionMapper;

    constructor(api: ApiUtil, private users: UsersService, private currencies: CurrenciesService,
        private http: HttpClient, private firebaseNative: Firebase, private ngZone: NgZone,
        private platform: Platform, private localNotifications: LocalNotifications, private af: AngularFirestore,
        private modals: ModalUtil){
        super(api);
        this.mapper = new TransactionMapper(currencies,users);
    }

    transactionTabRootChange = new EventEmitter<any>();
    setTransactionTabRoot(rootPage: 'TRANSACTION_IN_PROGRESS' | 'QUOTE' | 'OFFERINGS'){
        this.transactionTabRootChange.emit(rootPage);
    }

    find(specification?: BaseSpecification): Observable<Transaction[]> {
        if( specification instanceof MyPendingTransactions ){
            let params = new HttpParams();
            params = params.append('status_ne','0');
            params = params.append('status_ne','1');
            if( this.users.currentUser.userType == '0' ){
                params = params.append('person',this.users.currentUser.person.id.toString());
            }else{
                params = params.append('exchangeagent',this.users.currentUser.exchangeAgent.id.toString());
            }
            return this.api.get('/transactions',{
                params
            }).map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) );
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }else{
            let params = new HttpParams();
            params = params.append('_sort','id:DESC');
            if( this.users.currentUser.userType == '0' ){
                params = params.append('person',this.users.currentUser.person.id.toString());
            }else{
                params = params.append('exchangeagent',this.users.currentUser.exchangeAgent.id.toString());
            }
            return this.api.get('/transactions',{
                params
            }).map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) );
            }).catch( err => {
                console.error(err);
                return Observable.of([]);
            });
        }
    }    
    findOne(specification?: BaseSpecification): Observable<Transaction> {
        if( specification instanceof ByIdSpecification ){
            return this.api.get(`/transactions?id=${specification.id}`).map( resp => {
                return this.mapper.mapFromBe(resp[0]);
            }).catch( err => {
                console.error(err);
                return Observable.of(null);
            }); 
        }
        throw new Error("Method not implemented.");
    }
    add(entity: Transaction): Observable<Transaction> {
        return this.api.post('/transactions',{
            person: entity.person.id,
        	exchangeagent: entity.exchangeAgent.id,
        	exchangeagentoffering: entity.exchangeAgentOffering.id,
        	amount: entity.amount
        }).map( resp => {
            return this.mapper.mapFromBe(resp);
        }).catch(err => {
            console.error(err);
            return Observable.of(null);
        });
    }
    update(entity: Transaction): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Transaction): Observable<Transaction> {
        throw new Error("Method not implemented.");
    }
    
    rejectTransaction(transaction: Transaction): Observable<boolean>{
        return this.api.put(`/transactions/${transaction.id}`,{
            status: '0',
            rejectionReason: transaction.rejectionReason,
            cancelledBy: 'EXCHANGE_AGENT'
        }).map( resp => {
            return true; 
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    acceptTransaction(transaction: Transaction): Observable<boolean>{
        return this.api.put(`/transactions/${transaction.id}`,{
            status: '3'
        }).map( resp => {
            return true; 
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    setTransactionBankAccount( userBankAccount: UserBankAccount, transaction: Transaction ): Observable<boolean>{
        let bankAccountToSet = this.users.currentUser.userType == '0' ? 'personbankaccount' : 'exchangeagentbankaccount';
        return this.api.put(`/transactions/${transaction.id}`,{
            [bankAccountToSet]: userBankAccount.id
        }).map( resp => {
            return true;
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    uploadVoucher( transaction: Transaction, voucher: Image ): Observable<boolean>{
        let formData = new FormData();
        formData.append('files', voucher.file, voucher.name || moment().format('YYYY-MM-DD HH:mm:ss')+'.jpg' );
        formData.append('path','transactions');
        formData.append('refId',transaction.id.toString());
        formData.append('ref','transaction');
        if( this.users.currentUser.isPerson() ){
            formData.append('field','userTransactionImage');
        }else{
            formData.append('field','exchangeAgentTransactionImage');
        }
        return this.api.post('/upload',formData)
        .map( resp => {
            return true;
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        })
    }
    
    groupByMonth(transactions: Transaction[]): { period: { year: number, month: number }, transactions: Transaction[] }[]{
        let groups = groupBy( transactions, (tx) => moment(tx.created_at).format('YYYY-MM') );
        return Object.keys( groups )
        .map( periodString => ({
            period: { year: Number(periodString.split('-')[0]), month: Number(periodString.split('-')[1]) },
            transactions: groups[periodString]
        }) );
    }

    cancelTransaction(transaction: Transaction){
        return this.api.put(`/transactions/${transaction.id}`,{
            status: '0',
            cancelledBy: 'PERSON'
        }).map( resp => {
            return true; 
        }).catch( err => {
            console.error(err);
            return Observable.of(false);
        });
    }

    transactionChange(transaction: Transaction): Observable<Transaction>{
        return this.af.collection('transactions').doc(String(transaction.id))
        .valueChanges()
        .delay(3000)
        .map( (transaction:any) => {
            return transaction ? new Transaction({...transaction}) : null;
        });
    }

    setCurrentTransaction(transaction: Transaction): Observable<boolean>{
        return this.findOne( new ByIdSpecification(transaction.id) )
        .map( tx => {
            this.users.currentUser.currentTransaction = tx;
            return true;
        })
    }

    clearCurrentTransaction(){
        this.users.currentUser.currentTransaction = undefined;
    }

}