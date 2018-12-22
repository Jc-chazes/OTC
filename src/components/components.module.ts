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
import { TransferIsRealizedModalComponent } from './transfer-is-realized-modal/transfer-is-realized-modal';
import { SuccessfulTransactionModalComponent } from './successful-transaction-modal/successful-transaction-modal';
import { OpportunityToParticipateModalComponent } from './opportunity-to-participate-modal/opportunity-to-participate-modal';
import { CouldNotParticipateModalComponent } from './could-not-participate-modal/could-not-participate-modal';
import { CouldParticipateModalComponent } from './could-participate-modal/could-participate-modal';
import { YouHasBeenSelectedModalComponent } from './you-has-been-selected-modal/you-has-been-selected-modal';
import { TermsAndConditionsModalComponent } from './terms-and-conditions-modal/terms-and-conditions-modal';
import { HeaderComponent } from './header/header';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
	declarations: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent,
    RejectAcceptRequestPopoverComponent,
    CreateUserBankAccountFormComponent,
    TransferIsRealizedModalComponent,
    SuccessfulTransactionModalComponent,
    OpportunityToParticipateModalComponent,
    CouldNotParticipateModalComponent,
    CouldParticipateModalComponent,
    YouHasBeenSelectedModalComponent,
    TermsAndConditionsModalComponent,
    HeaderComponent],
	imports: [ CommonModule, IonicModule, DirectivesModule ],
	exports: [UpdateExchangeReminderComponent,
    StepperComponent,
    CountdownComponent,
    RejectWarningComponent,
    RejectReasonSelectComponent,
    RejectAcceptRequestPopoverComponent,
    CreateUserBankAccountFormComponent,
    TransferIsRealizedModalComponent,
    SuccessfulTransactionModalComponent,
    OpportunityToParticipateModalComponent,
    CouldNotParticipateModalComponent,
    CouldParticipateModalComponent,
    YouHasBeenSelectedModalComponent,
    TermsAndConditionsModalComponent,
    HeaderComponent],
    entryComponents: [
        RejectWarningComponent,
        RejectReasonSelectComponent,
        RejectAcceptRequestPopoverComponent,
        TransferIsRealizedModalComponent,
        SuccessfulTransactionModalComponent,
        OpportunityToParticipateModalComponent,
        CouldNotParticipateModalComponent,
        CouldParticipateModalComponent,
        YouHasBeenSelectedModalComponent,
        TermsAndConditionsModalComponent
    ]
})
export class ComponentsModule {}
