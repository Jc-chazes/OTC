import { NgModule } from '@angular/core';
import { UpdateExchangeReminderComponent } from './update-exchange-reminder/update-exchange-reminder';
import { StepperComponent } from './stepper/stepper';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown/countdown';
import { RejectWarningComponent } from './reject-warning/reject-warning';
import { IonicModule } from 'ionic-angular';
import { RejectReasonSelectComponent } from './reject-reason-select/reject-reason-select';
@NgModule({
	declarations: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent],
	imports: [ CommonModule, IonicModule ],
	exports: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent],
    entryComponents: [
        RejectWarningComponent,
        RejectReasonSelectComponent
    ]
})
export class ComponentsModule {}
