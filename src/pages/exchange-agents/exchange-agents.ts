import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataService } from '../../providers/data.service';
import { DetailExchangeAgentPage } from '../detail-exchange-agent/detail-exchange-agent';
import { AppStateService } from '../../providers/app-state.service';


@Component({
  selector: 'page-exchange-agents',
  templateUrl: 'exchange-agents.html',
})
export class ExchangeAgentsPage {
  searchTerm: string = '';
  searchControl: FormControl;
  exchange_agents: any;
  searching: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,public appService : AppStateService) {
    this.searchControl = new FormControl();
  }
  public counter(i: number) {
    return new Array(i);
  }
  ionViewDidLoad() {
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search  => {
      this.searching = false;
      this.setFilteredItems();
      });
  }
  onSearchInput(){
  this.searching = true;
    }

  setFilteredItems() {
    this.exchange_agents = this.dataService.filterItems(this.searchTerm);
  }

  public detailExchangeAgent(item :any){
    this.appService.setState({detail_exchangue:item})
    this.navCtrl.push(DetailExchangeAgentPage)
  }
}