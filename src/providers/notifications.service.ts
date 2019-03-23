import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { BaseSpecification, ByIdSpecification } from './specifications/base.specification';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable, EventEmitter } from "@angular/core";
import { MyNotificationsSpecification } from "./specifications/notification.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { Notification } from "../models/notification.model";
import { Transaction } from "../models/transaction.model";
import { uniqBy, sortBy } from 'lodash';
import { NotificationMapper } from "./mappers/notification.mapper";
import { ModalController, Platform, Tabs, ToastController } from "ionic-angular";
import { Firebase } from "@ionic-native/firebase";
import { AvailableModals, ModalUtil } from "./utils/modal.util";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { TransactionsService } from "./transaction.service";
import { EventsUtil } from "./utils/events.util";
import { StorageUtil, StorageKeys } from "./utils/storage.util";
import { AngularFirestore } from "angularfire2/firestore";
import { ContestsService } from "./contests.service";

@Injectable()
export class NotificationsService extends BaseService implements CrudService<Notification>{

    mapper = new NotificationMapper();
    onTabChangeRequested = new EventEmitter<{data: any, tabIndex: number, type: string}>();
    pendingTransactionsCounter: BehaviorSubject<number>;

    constructor(api: ApiUtil, private users: UsersService, private firebaseNative: Firebase,
    private platform: Platform, private modals: ModalUtil, private localNotifications: LocalNotifications,
    private transactions: TransactionsService, private toast: ToastController, private events: EventsUtil, 
    private storage: StorageUtil, private af: AngularFirestore, private contests: ContestsService){
        super(api);
        this.pendingTransactionsCounter = new BehaviorSubject<number>( Number(storage.load(StorageKeys.PENDING_TRANSACTIONS_COUNTER)) );
    }

    clearPendingTransactionsCounter(){
        this.storage.remove( StorageKeys.PENDING_TRANSACTIONS_COUNTER );
        this.pendingTransactionsCounter.next(null);
    }

    incrementPendingTransactionsCounter(){
        let currentCounter = this.pendingTransactionsCounter.value;
        let newCounter = currentCounter + 1;
        this.pendingTransactionsCounter.next(newCounter);
        this.storage.save(StorageKeys.PENDING_TRANSACTIONS_COUNTER,String(newCounter));
    }

    find(specification?: BaseSpecification): Observable<Notification[]> {
        if( specification instanceof MyNotificationsSpecification ){
            return this.api.get(`/notifications?user=${this.users.currentUser.id}&_sort=id:DESC`)
            .map( resp => {
                return resp.map( be => this.mapper.mapFromBe(be) )
            })
            .catch( err => {
                console.error( err );
                return Observable.of([]);
            });
        }
        throw new Error("Method not implemented.");
    }    
    findOne(specification?: BaseSpecification): Observable<Notification> {
        throw new Error("Method not implemented.");
    }
    add(entity: Notification): Observable<Notification> {
        throw new Error("Method not implemented.");
    }
    update(entity: Notification): Observable<Notification> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Notification): Observable<Notification> {
        throw new Error("Method not implemented.");
    }

    buildNotificationsGroups(notificationList: Notification[]): Transaction[]{
        let groups: { [id: string] : { notifications: Notification[] } } = notificationList.reduce( (prev,curr) => {
            if( !curr.transaction ){
                curr.transaction = new Transaction({ id: `${curr.type}_${curr.id}` });
            }
            if( !prev[curr.transaction.id] ){
                prev[curr.transaction.id] = { notifications: [] };
            }
            prev[curr.transaction.id].notifications.push( curr );
            return prev;
        },{});
        Object.keys(groups).forEach( transactionId => {
            groups[transactionId].notifications = sortBy(groups[transactionId].notifications,'created_at').reverse();
        });
        let toReturn = Object.keys(groups).reduce( (prev,curr) => {
            let transaction = groups[curr].notifications[0].transaction;
            let title = groups[curr].notifications[0].title;
            let notificationCreatedAt = groups[curr].notifications[0].created_at;
            return prev.concat([
                new Transaction({ 
                    id: transaction.id,
                    code: transaction.id && !isNaN(transaction.id) ? `Transaccion #${transaction.code}` : title || 'Feliz cumpleaños',
                    created_at: transaction.created_at || notificationCreatedAt,
                    notifications: groups[curr].notifications
                })
            ]);
        },[]);
        toReturn = sortBy( toReturn, 'created_at' ).reverse();
        return toReturn;
    }

    listenToNotifications(modalCtrl: ModalController, currentTabs: Tabs): Observable<any>{
        if( !this.users.currentUser ){
            return;
        }
        return this.af.collection(`users/${this.users.currentUser.id}/notifications`, 
            ref => ref.where( 'read', '==', false ).orderBy( 'created', 'asc' ).limit(1)
        )
        /*.valueChanges()*/
        .snapshotChanges()
        .map( ([ doc ]) => {
            if( !doc ){
                return undefined;
            }
            let docData = {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
            };
            // console.log(docData);
            return [ docData ] as any[];
        })
        .filter( notifications => !!notifications )
        .do( ( [notification] : Notification[]) => {
            console.log(notification);
            if( !!notification ){
                // alert('Llegó una notificación de: '+notification.type);
                notification.transaction = new Transaction({ id: Number(notification.transaction) });
                this.processNotification(modalCtrl,notification,currentTabs); 
            }
        });
    }

    markAsRead(notificationId: number): Observable<boolean>{
        return this.api.put(`/notifications/${notificationId}/markAsRead`)
        .map( resp => {
            return true;
        })
        .catch( err => {
            console.error( err );
            return Observable.of(false);
        });
    }

    showLocalNotification(notification: Notification){        
        if( this.platform.is('ios') ){
            this.localNotifications.schedule({
                title: 'OTC Perú',
                text: notification.content,
                color: '#23c7b1',
                smallIcon: 'res://notification_icon.png',
                icon:'file://assets/images/icon.png',
                foreground: true
            });
            
        }
    }

    processNotification(modalCtrl: ModalController, notification: Notification, currentTabs: Tabs){
        this.showLocalNotification( notification );
        switch(notification.type){
            case 'NEW_CONTEST':
                let contestId = Number(notification['contestId']);
                this.contests.findOne( new ByIdSpecification(contestId) )
                .subscribe( (contest) => {
                    if( contest.active ){
                        this.modals.openModal(modalCtrl,AvailableModals.OpportunityToParticipate,{
                            ...notification
                        }).then( couldParticipate => {
                            this.markAsRead( notification.id ).subscribe();
                            if( couldParticipate ){
                                this.modals.openModal(modalCtrl,AvailableModals.CouldParticipateModal);
                            }/*else{
                                this.modals.openModal(modalCtrl,AvailableModals.CouldNotParticipateModal);
                            }*/
                        });
                    }else{
                        this.markAsRead( notification.id ).subscribe();
                    }
                })
                break;
            case 'REJECTED_CONTEST':
                this.modals.openModal(modalCtrl,AvailableModals.YouHasNotBeenSelectedModal)
                .then( () => {
                    this.markAsRead( notification.id ).subscribe();
                });
                break;
            case 'SUCCESSFUL_CONTEST':
                this.modals.openModal(modalCtrl,AvailableModals.YouHasBeenSelectedModal)
                .then( () => {
                    this.markAsRead( notification.id ).subscribe();
                    let transactionId = Number(notification.transaction.id);
                    this.transactions.findOne( new ByIdSpecification(transactionId) )
                    .subscribe( transaction => {
                        this.users.currentUser.currentTransaction = transaction;
                        currentTabs.select(0);
                    })    
                });                        
                break;
            case 'ACCEPTED_BY_EXCHANGE_AGENT':
                if( this.users.currentUser.isPerson() ){
                    this.modals.openModal(modalCtrl,AvailableModals.RequestWasAcceptedModal)
                    .then(()=>{
                        this.markAsRead( notification.id ).subscribe();
                        // currentTabs.select(1);
                    });                     
                }else{
                    this.markAsRead( notification.id ).subscribe();
                }
                break;
            case 'NEW_PENDING_TRANSACTION':
                this.events.reloadPendingTransactions.emit();
                this.incrementPendingTransactionsCounter();
                if( this.users.currentUser.isExchangeAgent() && !this.events.exchangeAgentRequestsIsShowing.value ){
                    currentTabs.select(1);
                }
                this.markAsRead( notification.id ).subscribe();
                break;
            case 'REJECTED_BY_EXCHANGE_AGENT':
                // console.log(notification.cancelledBy);

                var showQuoteAgainModal = () => {

                    this.modals.openModal(modalCtrl,AvailableModals.QuoteAgainModal)
                    .then( (quoteAgain) => {
                        // alert(quoteAgain);
                        // alert(currenTabs? 'Existe currentTabs' : 'No existe currentTabs');
                        this.markAsRead( notification.id ).subscribe();
                        if( quoteAgain ){
                            currentTabs.select(0);
                        }else{
                            currentTabs.select(1);
                        }
                    });

                }

                if( this.users.currentUser.isPerson() ){
                    this.modals.openModal(modalCtrl,AvailableModals.RequestWasRejectedModal,{
                        rejectionReason: notification.rejectionReason,
                        exchangeAgentType: notification['exchangeAgentType'],
                        cancelledBy: 'EXCHANGE_AGENT'
                    }).then( scoreExchangeAgent => {
                        if( scoreExchangeAgent ){
                            let transactionId = Number(notification.transaction.id);
                            this.transactions.findOne( new ByIdSpecification(transactionId) )
                            .subscribe( transaction => {
                                this.modals.openModal(modalCtrl,AvailableModals.ScoreYourExperienceModal,{
                                    transaction
                                }).then(()=>{
                                    showQuoteAgainModal();
                                });
                            });                          
                        }else{
                            showQuoteAgainModal();
                        }
                    })
                }else{
                    this.markAsRead( notification.id ).subscribe();
                }
                break;
            case 'REJECTED_BY_PERSON':
                // console.log(notification.cancelledBy);
                if( this.users.currentUser.isExchangeAgent() ){
                    this.events.reloadPendingTransactions.emit();
                    this.modals.openModal(modalCtrl,AvailableModals.RequestWasRejectedModal,{
                        rejectionReason: notification.rejectionReason,
                        cancelledBy: 'PERSON'
                    })
                    .then(()=>{
                        this.markAsRead( notification.id ).subscribe();
                        // currentTabs.select(1);
                    });
                }else{
                    this.markAsRead( notification.id ).subscribe();
                }
                break;
            case 'RECEIPT_SENT':
                if( this.users.currentUser.isPerson() ){
                    let transactionId = Number(notification.transaction.id);
                    this.transactions.findOne( new ByIdSpecification(transactionId) )
                    .subscribe( transaction => {
                        this.modals.openModal(modalCtrl,AvailableModals.ScoreYourExperienceModal,{
                            transaction
                        }).then( () => {
                            this.markAsRead( notification.id ).subscribe();
                        });
                    });
                }else{
                    this.markAsRead( notification.id ).subscribe();
                }                             
                break;
            case 'TRANSACTION_SCORE':
                this.modals.openModal(modalCtrl,AvailableModals.ScoreResultModal,{
                    personName: notification['personName'],
                    score: notification['score']
                }).then(()=>{
                    this.markAsRead( notification.id ).subscribe();
                });
                break;
            default:
                this.markAsRead( notification.id ).subscribe();
                break;
        }
    }

    initListenNotifications(modalCtrl: ModalController, currentTabs?: Tabs): Observable<any>{
        return this.listenToNotifications(modalCtrl,currentTabs);
        /*(window as any).FirebasePlugin.onNotificationOpen(function(notification) {
            alert(JSON.stringify(notification));
        }, function(error) {
            alert(JSON.stringify(error));
        });
        alert("Listen to contests")
        this.firebaseNative.onTokenRefresh().subscribe((token: string) => {
            alert("Token on refresh"+token);
        }, e => {
            alert(JSON.stringify(e));
        });*/
        /*try{
            this.firebaseNative.onNotificationOpen().subscribe( (notification) => {
                // if(notification.tap 
                //     // && !this.platform.is('ios') 
                // ){
                //     return ;
                // }

                if( this.platform.is('ios') ){
                    alert('Notificacion en ios!!!');
                }
        
                let messageText: string;
                let messageTitle: string;
                
                if (this.platform.is('android')) {
                    messageText = notification.body;
                    messageTitle = notification.title;
                }
                
                if (this.platform.is('ios')) {
                    messageText = notification.aps.alert.title;
                    messageTitle = notification.aps.alert.body;
                    //alert(JSON.stringify(notification));
                }

                // this.toast.create({ message: 'Una notificación ha llegado!', duration: 3000 }).present();

                if( !notification.tap ){
                    this.localNotifications.schedule({
                        title: messageTitle || 'OTC',
                        text: messageText,
                        color: '#23c7b1',
                        smallIcon: 'res://notification_icon.png',
                        icon:'file://assets/images/icon.png',
                        foreground: true
                    });
                }     

                // alert(notification.type);

                switch(notification.type){
                    case 'NEW_CONTEST':
                        this.modals.openModal(modalCtrl,AvailableModals.OpportunityToParticipate,{
                            ...notification
                        }).then( couldParticipate => {
                            if( couldParticipate ){
                                this.modals.openModal(modalCtrl,AvailableModals.CouldParticipateModal);
                            }else{
                                this.modals.openModal(modalCtrl,AvailableModals.CouldNotParticipateModal);
                            }
                        });
                        break;
                    case 'REJECTED_CONTEST':
                        this.modals.openModal(modalCtrl,AvailableModals.YouHasNotBeenSelectedModal);
                        break;
                    case 'SUCCESSFUL_CONTEST':
                        this.modals.openModal(modalCtrl,AvailableModals.YouHasBeenSelectedModal)
                        .then( () => {
                            let transactionId = Number(notification.transactionId);
                            this.transactions.findOne( new ByIdSpecification(transactionId) )
                            .subscribe( transaction => {
                                this.users.currentUser.currentTransaction = transaction;
                                currentTabs.select(0);
                            })    
                        });                        
                        break;
                    case 'ACCEPTED_BY_EXCHANGE_AGENT':
                        if( this.users.currentUser.isPerson() ){
                            this.modals.openModal(modalCtrl,AvailableModals.RequestWasAcceptedModal)
                            .then(()=>{
                                currentTabs.select(1);
                            });
                            // .then( resp => {
                            //     let transactionId = Number(notification.transactionId);
                            //     this.transactions.findOne( new ByIdSpecification(transactionId) )
                            //     .subscribe( transaction => {
                            //         this.onTabChangeRequested.emit({ 
                            //             data:  { transaction },
                            //             tabIndex: 0,
                            //             type: notification.type
                            //         });
                            //     })
                            // })                            
                        }
                        break;
                    case 'NEW_PENDING_TRANSACTION':
                        this.events.reloadPendingTransactions.emit();
                        this.incrementPendingTransactionsCounter();
                        currentTabs.select(1);
                        break;
                    case 'REJECTED_BY_EXCHANGE_AGENT':
                        console.log(notification.cancelledBy);

                        var showQuoteAgainModal = () => {

                            this.modals.openModal(modalCtrl,AvailableModals.QuoteAgainModal)
                            .then( (quoteAgain) => {
                                // alert(quoteAgain);
                                // alert(currenTabs? 'Existe currentTabs' : 'No existe currentTabs');
                                if( quoteAgain ){
                                    currentTabs.select(0);
                                }else{
                                    currentTabs.select(1);
                                }
                            });

                        }

                        if( this.users.currentUser.isPerson() ){
                            this.modals.openModal(modalCtrl,AvailableModals.RequestWasRejectedModal,{
                                rejectionReason: notification.rejectionReason,
                                cancelledBy: 'EXCHANGE_AGENT'
                            }).then( scoreExchangeAgent => {
                                if( scoreExchangeAgent ){
                                    let transactionId = Number(notification.transactionId);
                                    this.transactions.findOne( new ByIdSpecification(transactionId) )
                                    .subscribe( transaction => {
                                        this.modals.openModal(modalCtrl,AvailableModals.ScoreYourExperienceModal,{
                                            transaction
                                        }).then(()=>{
                                            showQuoteAgainModal();
                                        });
                                    })                                    
                                }else{
                                    showQuoteAgainModal();
                                }
                            })
                        }
                        break;
                    case 'REJECTED_BY_PERSON':
                        console.log(notification.cancelledBy);
                        if( this.users.currentUser.isExchangeAgent() ){
                            this.modals.openModal(modalCtrl,AvailableModals.RequestWasRejectedModal,{
                                rejectionReason: notification.rejectionReason,
                                cancelledBy: 'PERSON'
                            })
                            .then(()=>{
                                currentTabs.select(1);
                            });
                        }
                        break;
                }
                
            });
        }catch(err){
            console.error(err);
        }*/
    }


}