import { NgModule } from '@angular/core';
import { UpdateExchangeReminderComponent } from './update-exchange-reminder/update-exchange-reminder';
import { StepperComponent } from './stepper/stepper';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown/countdown';
import { RejectWarningComponent } from './reject-warning/reject-warning';
import { IonicModule } from 'ionic-angular';
import { RejectReasonSelectComponent } from './reject-reason-select/reject-reason-select';
import { RejectAcceptRequestPopoverComponent } from './reject-accept-request-popover/reject-accept-request-popover';
import { CreateUserBankAccountFormComponent } from './create-user-bank-account-form/create-user-bank-account-form';
@NgModule({
	declarations: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent,
    RejectAcceptRequestPopoverComponent,
    CreateUserBankAccountFormComponent],
	imports: [ CommonModule, IonicModule ],
	exports: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent,
    RejectAcceptRequestPopoverComponent,
    CreateUserBankAccountFormComponent],
    entryComponents: [
        RejectWarningComponent,
        RejectReasonSelectComponent,
        RejectAcceptRequestPopoverComponent
    ]
})
export class ComponentsModule {}
