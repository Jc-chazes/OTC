import { NgModule } from '@angular/core';
import { UpdateExchangeReminderComponent } from './update-exchange-reminder/update-exchange-reminder';
import { StepperComponent } from './stepper/stepper';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown/countdown';
@NgModule({
	declarations: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent],
	imports: [ CommonModule ],
	exports: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent]
})
export class ComponentsModule {}
