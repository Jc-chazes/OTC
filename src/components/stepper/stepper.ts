import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

export class Step {
  
  step: number;
  stepLabel: string;

}

@Component({
  selector: 'stepper',
  templateUrl: 'stepper.html'
})
export class StepperComponent implements OnInit {

  @Input() steps: Step[];
  @Input() mode: 'exchange-agent' | 'customer';
  @Input() currentStep: number;
  @Output() onStep: EventEmitter<Step> = new EventEmitter<Step>();

  text: string;

  constructor() {
    console.log('Hello StepperComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    if(this.mode == 'exchange-agent'){
      this.steps = [
        { step: 1, stepLabel: 'Tus solicitudes' },
        { step: 2, stepLabel: 'Detalles de solicitud' },
        { step: 3, stepLabel: 'a52' },
        { step: 4, stepLabel: 'a52' },
        { step: 5, stepLabel: 'a52' }
      ]
    }
  }

  onTapStep(step: Step){
    this.onStep.emit(step);
  }

}
