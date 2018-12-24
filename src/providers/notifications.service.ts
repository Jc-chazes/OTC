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

@Injectable()
export class NotificationsService extends BaseService implements CrudService<Notification>{

    mapper = new NotificationMapper();

    constructor(api: ApiUtil, private users: UsersService){
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


}