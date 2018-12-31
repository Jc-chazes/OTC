import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertUtil } from '../../providers/utils/alert.util';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { ContestsService } from '../../providers/contests.service';
import { LoadingUtil } from '../../providers/utils/loading.util';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { Contest } from '../../models/contest.model';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { UsersService } from '../../providers/users.service';

/**
 * Generated class for the PersonSelectSearchModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-person-select-search-mode',
  templateUrl: 'person-select-search-mode.html',
})
export class PersonSelectSearchModePage {

  selectedSearch: 'FAST' | 'SAFE';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alerts: AlertUtil, private contests: ContestsService, private loading: LoadingUtil,
    private modals: ModalUtil, private modalCtrl: ModalController, private users: UsersService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonSelectSearchModePage');
  }

  continue(){
    if( !this.selectedSearch ){
      this.alerts.show('Debes elegir un tipo de búsqueda','Búsqueda');
      return;
    }
    if( this.selectedSearch == 'FAST' ){
      this.loading.show();
      this.contests.createContest({ 
        amount: this.navParams.get('amount'),
        currency: this.navParams.get('currency'),
        operation: this.navParams.get('operation')
      }).subscribe( createdContest => {
        this.loading.hide();
        this.modals.openModal(this.modalCtrl,AvailableModals.FastSearchModal,{ contest: { id: createdContest.id } })
        .then( (contestFromModal: Contest) => {
          if( contestFromModal ){
            this.contests.findOne( new ByIdSpecification(createdContest.id) )
            .subscribe( result => {
              if(result){
                this.users.currentUser.person.currentContest = result;
                this.navCtrl.push(ExchangeAgentsPage,{
                  operation: result.operationType,
                  currency: result.targetCurrency,
                  amount: result.amount,
                  contest: result
                });
              }else{
                this.alerts.show('Lo sentimos, al parecer no hubo ningún agente de cambio disponible.','OTC Búsqueda rápida');
              }
            })
          }
        });
      })
    }else{
      this.navCtrl.push(ExchangeAgentsPage,{
        ...this.navParams.data
      });
    }
  }

}
