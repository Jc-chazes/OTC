import { BaseService } from "./base/base.service";
import { CrudService } from "./contracts/crud.service";
import { BaseSpecification } from './specifications/base.specification';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { MyNotificationsSpecification } from "./specifications/notification.specification";
import { ApiUtil } from "./utils/api.util";
import { UsersService } from "./users.service";
import { Notification } from "../models/notification.model";
import { Transaction } from "../models/transaction.model";
import { uniqBy, sortBy } from 'lodash';
import { NotificationMapper } from "./mappers/notification.mapper";
import { ModalController, Platform } from "ionic-angular";
import { Firebase } from "@ionic-native/firebase";
import { AvailableModals, ModalUtil } from "./utils/modal.util";
import { LocalNotifications } from "@ionic-native/local-notifications";

@Injectable()
export class NotificationsService extends BaseService implements CrudService<Notification>{

    mapper = new NotificationMapper();

    constructor(api: ApiUtil, private users: UsersService, private firebaseNative: Firebase,
    private platform: Platform, private modals: ModalUtil, private localNotifications: LocalNotifications){
        super(api);
    }

    find(specification?: BaseSpecification): Observable<Notification[]> {
        if( specification instanceof MyNotificationsSpecification ){
            return this.api.get(`/notifications?user=${this.users.currentUser.id}`)
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

    listenToContests(modalCtrl: ModalController){
        try{
            this.firebaseNative.onNotificationOpen().subscribe( (notification) => {
    
                alert(JSON.stringify(notification));

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
        
                this.localNotifications.schedule({
                    title: messageTitle,
                    text: messageText,
                    color: '#23c7b1',
                    smallIcon: 'res://notification_icon.png',
                    icon:'file://assets/images/icon.png'
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
                        this.modals.openModal(modalCtrl,AvailableModals.YouHasBeenSelectedModal);
                        break;
                }
                
            });
        }catch(err){
            console.error(err);
        }
    }


}