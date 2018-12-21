import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { componentDestroyed } from '../../helpers/observable.helper';

/**
 * Generated class for the UpdateExchangeReminderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'update-exchange-reminder',
  templateUrl: 'update-exchange-reminder.html'
})
export class UpdateExchangeReminderComponent implements OnInit, OnDestroy  {

  show = true;

  constructor(private elmRef: ElementRef) {
    console.log('Hello UpdateExchangeReminderComponent Component');
  }

  ngOnInit(){
    Observable.interval(1500)
    .takeUntil( componentDestroyed(this) )
    .subscribe( () => {
      if( this.show ){
        this.elmRef.nativeElement.style.visibility = 'hidden';        
      }else{
        this.elmRef.nativeElement.style.visibility = 'visible';
      }
      this.show = !this.show;
    })
  }

  ngOnDestroy(){
    
  }
}
