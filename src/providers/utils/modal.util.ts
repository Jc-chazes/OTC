import { Injectable } from "@angular/core";
import { ModalController, ModalOptions, Modal } from "ionic-angular";
import { TermsAndConditionsModalComponent } from "../../components/terms-and-conditions-modal/terms-and-conditions-modal";
import { OpportunityToParticipateModalComponent } from "../../components/opportunity-to-participate-modal/opportunity-to-participate-modal";
import { CouldNotParticipateModalComponent } from "../../components/could-not-participate-modal/could-not-participate-modal";
import { CouldParticipateModalComponent } from "../../components/could-participate-modal/could-participate-modal";
import { YouHasBeenSelectedModalComponent } from "../../components/you-has-been-selected-modal/you-has-been-selected-modal";
import { YouHasNotBeenSelectedModalComponent } from "../../components/you-has-not-been-selected-modal/you-has-not-been-selected-modal";

export enum  AvailableModals{
    TermsAndConditions,
    OpportunityToParticipate,
    CouldNotParticipateModal,
    CouldParticipateModal,
    YouHasBeenSelectedModal,
    YouHasNotBeenSelectedModal
};

@Injectable()
export class ModalUtil{

    openModal(modalCtrl: ModalController, modal: AvailableModals, data?: any,
        options: ModalOptions = {}): Promise<any>{

        let modalInstance: Modal = null;

        switch(modal){
            case AvailableModals.TermsAndConditions:
                modalInstance = modalCtrl.create(TermsAndConditionsModalComponent,data,
                Object.assign({},options,{ cssClass: 'alertModal termsAndConditionsModal' }));
                break;
            case AvailableModals.OpportunityToParticipate:
                modalInstance = modalCtrl.create(OpportunityToParticipateModalComponent,data,
                Object.assign({ enableBackdropDismiss: false },options,{ cssClass: 'alertModal opportunityToParticipateModal' }));
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
        }

        modalInstance.present();

        return new Promise( (resolve,reject) => {
            modalInstance.onDidDismiss( data => {
                resolve(data)
            });
        });

    }

}