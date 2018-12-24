import { Injectable } from "@angular/core";
import { ModalController, ModalOptions, Modal } from "ionic-angular";
import { TermsAndConditionsModalComponent } from "../../components/terms-and-conditions-modal/terms-and-conditions-modal";

export enum  AvailableModals{
    TermsAndConditions
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
        }

        modalInstance.present();

        return new Promise( (resolve,reject) => {
            modalInstance.onDidDismiss( data => {
                resolve(data)
            });
        });

    }

}