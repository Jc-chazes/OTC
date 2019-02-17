import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { BaseSpecification, ByIdSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
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

@Injectable()
export class NotificationsService extends BaseService implements CrudService<Notification>{

    mapper = new NotificationMapper();
    onTabChangeRequested = new EventEmitter<{data: any, tabIndex: number, type: string}>();

    constructor(api: ApiUtil, private users: UsersService, private firebaseNative: Firebase,
    private platform: Platform, private modals: ModalUtil, private localNotifications: LocalNotifications,
    private transactions: TransactionsService, private toast: ToastController){
        super(api);
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
            return prev.concat([
                new Transaction({ 
                    id: transaction.id,
                    code: transaction.code,
                    created_at: transaction.created_at,
                    notifications: groups[curr].notifications
                })
            ]);
        },[]);
        toReturn = sortBy( toReturn, 'created_at' ).reverse();
        return toReturn;
    }

    listenToContests(modalCtrl: ModalController, currenTabs?: Tabs){
        try{
            this.firebaseNative.onNotificationOpen().subscribe( (notification) => {
                // if(notification.tap){
                //     return ;
                // }
        
                let messageText: string;
                let messageTitle: string;
                
                if (this.platform.is('android')) {
                    messageText = notification.body;
                    messageTitle = notification.title;
                }
                
                if (this.platform.is('ios')) {
                    messageText = notification.aps.alert;
                }

                this.toast.create({ message: 'Una notificación ha llegado!' }).present();
        
                this.localNotifications.schedule({
                    title: messageTitle || 'OTC',
                    text: messageText,
                    color: '#23c7b1',
                    smallIcon: 'res://notification_icon.png',
                    icon:'file://assets/images/icon.png',
                    foreground: true
                });

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
                                currenTabs.select(0);
                            })    
                        });                        
                        break;
                    case 'ACCEPTED_BY_EXCHANGE_AGENT':
                        if( this.users.currentUser.isPerson() ){
                            this.modals.openModal(modalCtrl,AvailableModals.RequestWasAcceptedModal);
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
                    case 'REJECTED_BY_EXCHANGE_AGENT':
                        console.log(notification.cancelledBy);

                        var showQuoteAgainModal = () => {

                            this.modals.openModal(modalCtrl,AvailableModals.QuoteAgainModal)
                            .then( (quoteAgain) => {
                                // alert(quoteAgain);
                                // alert(currenTabs? 'Existe currentTabs' : 'No existe currentTabs');
                                if( quoteAgain ){
                                    currenTabs.select(0);
                                }else{
                                    currenTabs.select(1);
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
                        }
                        break;
                }
                
            });
        }catch(err){
            console.error(err);
        }
    }


}