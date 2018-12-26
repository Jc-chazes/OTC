import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { padStart } from 'lodash';

/**
 * Generated class for the CountdownComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'countdown',
  templateUrl: 'countdown.html'
})
export class CountdownComponent implements OnDestroy, OnInit{

  @Input() date: Date;

  remainingText: string;
  remainingTime: number;
  @Output() final: EventEmitter<any> = new EventEmitter<any>(); 
  objectDestroy: EventEmitter<any> = new EventEmitter<any>(); 
  finalReached = false;

  constructor() {
   
  }

  ngOnInit(){
    this.calculateRemainingText();
    Observable.interval(1000)
    .takeUntil( this.objectDestroy.asObservable() )
    .subscribe( () => {
      this.calculateRemainingText();      
    })
  }

  calculateRemainingText(){
    this.remainingTime = this.date.getTime() - (new Date()).getTime();
    if( this.remainingTime < 0 ){
      this.remainingText = '00:00';
      if( !this.finalReached ){
        this.final.emit({});
        this.finalReached = true;
      }
      return; 
    }
    let remainingMinutes = Math.floor( this.remainingTime / 60000 );
    let remainingSeconds = Math.floor( ( this.remainingTime % 60000 ) / 1000 ) ;
    this.remainingText = `${padStart(remainingMinutes.toString(),2,'0')}:${padStart(remainingSeconds.toString(),2,'0')}`;
  }

  ngOnDestroy(){
    this.objectDestroy.emit({});
  }

}
