import { Component } from '@angular/core';
import { ConstantsService } from '../../providers/constants.service';
import { Observable } from 'rxjs';
import moment from 'moment';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the OfficeHoursReminderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'office-hours-reminder',
  templateUrl: 'office-hours-reminder.html'
})
export class OfficeHoursReminderComponent {

  weekStartTime: string;
  weekEndTime: string;
  weekendStartTime: string;
  weekendEndTime: string;

  constructor(private constants: ConstantsService, public viewCtrl: ViewController) {
    Observable.forkJoin(
      this.constants.findOneByCode('HORA_INICIO_JORNADA_TRABAJO_SEMANA'),
      this.constants.findOneByCode('HORA_FIN_JORNADA_TRABAJO_SEMANA'),
      this.constants.findOneByCode('HORA_INICIO_JORNADA_TRABAJO_FIN_DE_SEMANA'),
      this.constants.findOneByCode('HORA_FIN_JORNADA_TRABAJO_FIN_DE_SEMANA')
    ).subscribe( results => {let nowDate = new Date();
      let weekStartTime = results[0].content || '08:00';
      let weekEndTime = results[1].content || '20:00';
      let weekendStartTime = results[2].content || '08:00';
      let weekendEndTime = results[3].content || '20:00';
      let mWeekStartDate = moment( moment(nowDate).format("YYYY-MM-DD") + ' ' + weekStartTime + ':00' );
      let mWeekEndDate = moment( moment(nowDate).format("YYYY-MM-DD") + ' ' + weekEndTime + ':00' );
      let mWeekendStartDate = moment( moment(nowDate).format("YYYY-MM-DD") + ' ' + weekendStartTime + ':00' );
      let mWeekendEndDate = moment( moment(nowDate).format("YYYY-MM-DD") + ' ' + weekendEndTime + ':00' );
      this.weekStartTime = mWeekStartDate.format('hh:mm A');
      this.weekEndTime = mWeekEndDate.format('hh:mm A');
      this.weekendStartTime = mWeekendStartDate.format('hh:mm A');
      this.weekendEndTime = mWeekendEndDate.format('hh:mm A');
    });
  }

}
