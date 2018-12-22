import { BaseMapper } from "./base/base.mapper";
import { Notification } from "../../models/notification.model";
import moment from 'moment';

export class NotificationMapper extends BaseMapper<Notification>{

    type: new (partial?: Partial<Notification>) => Notification = Notification;

    mapFromBe(be): Notification{
        let target = new Notification({...be});
        let mCreatedAt = moment(target.created_at);
        target.timeLabel = {
            date: mCreatedAt.isSame(moment(),'day') ? 'Hoy' : mCreatedAt.format('DD/MM'),
            time: mCreatedAt.format('h:mm:ss a')
        };
        return target;
    }

}