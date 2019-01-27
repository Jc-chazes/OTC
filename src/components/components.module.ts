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
import { BackButtonComponent } from './back-button/back-button';
import { YouHasNotBeenSelectedModalComponent } from './you-has-not-been-selected-modal/you-has-not-been-selected-modal';
import { SelectExchangeAgentSearchPopoverComponent } from './select-exchange-agent-search-popover/select-exchange-agent-search-popover';
import { WaitYourRequestModalComponent } from './wait-your-request-modal/wait-your-request-modal';
import { RequestWasRejectedModalComponent } from './request-was-rejected-modal/request-was-rejected-modal';
import { RequestWasAcceptedModalComponent } from './request-was-accepted-modal/request-was-accepted-modal';
import { ScoreYourExperienceModalComponent } from './score-your-experience-modal/score-your-experience-modal';
import { QuoteAgainModalComponent } from './quote-again-modal/quote-again-modal';
import { CancelTransactionTriggerComponent } from './cancel-transaction-trigger/cancel-transaction-trigger';
import { FastSearchModalComponent } from './fast-search-modal/fast-search-modal';
import { CurrentNotificationWatcherComponent } from './current-notification-watcher/current-notification-watcher';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ContinueTransactionOrBackModalComponent } from './continue-transaction-or-back-modal/continue-transaction-or-back-modal';
import { RequestAcceptedComponent } from './request-accepted/request-accepted';

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
    HeaderComponent,
    BackButtonComponent,
    YouHasBeenSelectedModalComponent,
    YouHasNotBeenSelectedModalComponent,
    SelectExchangeAgentSearchPopoverComponent,
    WaitYourRequestModalComponent,
    RequestWasRejectedModalComponent,
    RequestWasAcceptedModalComponent,
    ScoreYourExperienceModalComponent,
    QuoteAgainModalComponent,
    CancelTransactionTriggerComponent,
    FastSearchModalComponent,
    CurrentNotificationWatcherComponent,
    ContinueTransactionOrBackModalComponent,
    RequestAcceptedComponent],
	imports: [ CommonModule, IonicModule, DirectivesModule, PdfViewerModule ],
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
    HeaderComponent,
    BackButtonComponent,
    YouHasBeenSelectedModalComponent,
    YouHasNotBeenSelectedModalComponent,
    SelectExchangeAgentSearchPopoverComponent,
    WaitYourRequestModalComponent,
    RequestWasRejectedModalComponent,
    RequestWasAcceptedModalComponent,
    ScoreYourExperienceModalComponent,
    QuoteAgainModalComponent,
    CancelTransactionTriggerComponent,
    FastSearchModalComponent,
    CurrentNotificationWatcherComponent,
    ContinueTransactionOrBackModalComponent,
    RequestAcceptedComponent],
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
        TermsAndConditionsModalComponent,
        YouHasBeenSelectedModalComponent,
        YouHasNotBeenSelectedModalComponent,
        SelectExchangeAgentSearchPopoverComponent,
        WaitYourRequestModalComponent,
        RequestWasRejectedModalComponent,
        RequestWasAcceptedModalComponent,
        ScoreYourExperienceModalComponent,
        QuoteAgainModalComponent,
        FastSearchModalComponent,
        ContinueTransactionOrBackModalComponent
    ]
})
export class ComponentsModule {}
