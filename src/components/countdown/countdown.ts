import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
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
  final: EventEmitter<any> = new EventEmitter<any>(); 

  constructor() {
   
  }

  ngOnInit(){
    this.calculateRemainingText();
    Observable.interval(1000)
    .takeUntil( this.final.asObservable() )
    .subscribe( () => {
      this.calculateRemainingText();      
    })
  }

  calculateRemainingText(){
    this.remainingTime = this.date.getTime() - (new Date()).getTime();
    if( this.remainingTime < 0 ){
      this.remainingText = '00:00';
      this.final.emit({});
      return; 
    }
    let remainingMinutes = Math.floor( this.remainingTime / 60000 );
    let remainingSeconds = Math.floor( ( this.remainingTime % 60000 ) / 1000 ) ;
    this.remainingText = `${padStart(remainingMinutes.toString(),2,'0')}:${padStart(remainingSeconds.toString(),2,'0')}`;
  }

  ngOnDestroy(){
    this.final.emit({});
  }

}
