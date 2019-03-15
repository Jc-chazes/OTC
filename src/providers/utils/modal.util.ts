import { Injectable } from "@angular/core";
import { ModalController, ModalOptions, Modal } from "ionic-angular";
import { TermsAndConditionsModalComponent } from "../../components/terms-and-conditions-modal/terms-and-conditions-modal";
import { OpportunityToParticipateModalComponent } from "../../components/opportunity-to-participate-modal/opportunity-to-participate-modal";
import { CouldNotParticipateModalComponent } from "../../components/could-not-participate-modal/could-not-participate-modal";
import { CouldParticipateModalComponent } from "../../components/could-participate-modal/could-participate-modal";
import { YouHasBeenSelectedModalComponent } from "../../components/you-has-been-selected-modal/you-has-been-selected-modal";
import { YouHasNotBeenSelectedModalComponent } from "../../components/you-has-not-been-selected-modal/you-has-not-been-selected-modal";
import { WaitYourRequestModalComponent } from "../../components/wait-your-request-modal/wait-your-request-modal";
import { RequestWasAcceptedModalComponent } from "../../components/request-was-accepted-modal/request-was-accepted-modal";
import { RequestWasRejectedModalComponent } from "../../components/request-was-rejected-modal/request-was-rejected-modal";
import { ScoreYourExperienceModalComponent } from "../../components/score-your-experience-modal/score-your-experience-modal";
import { QuoteAgainModalComponent } from "../../components/quote-again-modal/quote-again-modal";
import { FastSearchModalComponent } from "../../components/fast-search-modal/fast-search-modal";
import { ContinueTransactionOrBackModalComponent } from "../../components/continue-transaction-or-back-modal/continue-transaction-or-back-modal";
import { OfficeHoursReminderComponent } from "../../components/office-hours-reminder/office-hours-reminder";
import { SuccessfulSignUpModalComponent } from '../../components/successful-sign-up-modal/successful-sign-up-modal';

export enum  AvailableModals{
    TermsAndConditions,
    OpportunityToParticipate,
    CouldNotParticipateModal,
    CouldParticipateModal,
    YouHasBeenSelectedModal,
    YouHasNotBeenSelectedModal,
    WaitYourRequestModal,
    RequestWasRejectedModal,
    RequestWasAcceptedModal,
    ScoreYourExperienceModal,
    QuoteAgainModal,
    FastSearchModal,
    ContinueTransactionOrBackModal,
    OfficeHoursReminderModal,
    SuccessfulSignUpModal
};

@Injectable()
export class ModalUtil{

    openModal(modalCtrl: ModalController, modal: AvailableModals, data?: any,
        options: ModalOptions = {}): Promise<any>{

        let modalInstance: Modal = null;

        switch(modal){
            case AvailableModals.TermsAndConditions:
                modalInstance = modalCtrl.create(TermsAndConditionsModalComponent,data,
                Object.assign({},options,{ cssClass: 'termsAndConditionsModal' }));
                break;
            case AvailableModals.OpportunityToParticipate:
                modalInstance = modalCtrl.create(OpportunityToParticipateModalComponent,data,
                Object.assign({ enableBackdropDismiss: false },options,{ 
                    cssClass: 'alertModal opportunityToParticipateModal' }));
                break;
            case AvailableModals.CouldNotParticipateModal:
                modalInstance = modalCtrl.create(CouldNotParticipateModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal couldNotParticipateModalComponent' }));
                break;
            case AvailableModals.CouldParticipateModal:
                modalInstance = modalCtrl.create(CouldParticipateModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal couldParticipateModalComponent' }));
                break;
            case AvailableModals.YouHasBeenSelectedModal:
                modalInstance = modalCtrl.create(YouHasBeenSelectedModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal youHasBeenSelectedModalComponent' }));
                break;
            case AvailableModals.YouHasNotBeenSelectedModal:
                modalInstance = modalCtrl.create(YouHasNotBeenSelectedModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal youHasNotBeenSelectedModalComponent' }));
                break;
            case AvailableModals.WaitYourRequestModal:
                modalInstance = modalCtrl.create(WaitYourRequestModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal waitYourRequestModalComponent' }));
                break;
            case AvailableModals.RequestWasAcceptedModal:
                modalInstance = modalCtrl.create(RequestWasAcceptedModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal requestWasAcceptedModalComponent' }));
                modalInstance.onDidDismiss( () => {

                });
                break;
            case AvailableModals.RequestWasRejectedModal:
                modalInstance = modalCtrl.create(RequestWasRejectedModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal requestWasRejectedModalComponent' }));
                break;
            case AvailableModals.ScoreYourExperienceModal:
                modalInstance = modalCtrl.create(ScoreYourExperienceModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal scoreYourExperienceModalComponent' }));
                break;
            case AvailableModals.QuoteAgainModal:
                modalInstance = modalCtrl.create(QuoteAgainModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal quoteAgainModalComponent' }));
                break;
            case AvailableModals.FastSearchModal:
                modalInstance = modalCtrl.create(FastSearchModalComponent,data,
                Object.assign({ enableBackdropDismiss: false },options,{ cssClass: 'alertModal fastSearchModalComponent' }));
                break;
            case AvailableModals.ContinueTransactionOrBackModal:
                modalInstance = modalCtrl.create(ContinueTransactionOrBackModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal continueTransactionOrBackModalComponent' }));
                break;
            case AvailableModals.OfficeHoursReminderModal:
                modalInstance = modalCtrl.create(OfficeHoursReminderComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal officeHoursReminderModalComponent' }));
                break;
            case AvailableModals.SuccessfulSignUpModal:
                modalInstance = modalCtrl.create(SuccessfulSignUpModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal successfulSignUpModalComponent' }));
                break;
        }

        modalInstance.present();

        return new Promise( (resolve,reject) => {
            modalInstance.onDidDismiss( data => {
                resolve(data)
            });
        });

    }

}