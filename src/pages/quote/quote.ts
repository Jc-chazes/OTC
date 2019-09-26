import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AppStateService } from '../../providers/app-state.service';
import { ExchangeAgentsPage } from '../exchange-agents/exchange-agents';
import { DataService } from '../../providers/data.service';
import { Currency } from '../../models/currency.model';
import { CurrenciesService } from '../../providers/currencies.service';
import { AlertUtil } from '../../providers/utils/alert.util';
import { PersonSelectSearchModePage } from '../person-select-search-mode/person-select-search-mode';
import { UsersService } from '../../providers/users.service';
import { CommonSelectBankAccountPage } from '../common-select-bank-account/common-select-bank-account';
import { CommonTransferToOtcPage } from '../common-transfer-to-otc/common-transfer-to-otc';
import { ModalUtil, AvailableModals } from '../../providers/utils/modal.util';
import { ContestsService } from '../../providers/contests.service';
import { ByIdSpecification } from '../../providers/specifications/base.specification';
import { Contest } from '../../models/contest.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsService } from '../../providers/constants.service';
import { NumberPipe } from '../../pipes/numeric/number.pipe';

@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage implements OnInit {
  checkButton: number;
  selectedCurrencyLeft: Currency;
  selectedCurrencyRight: Currency;
  _cant: any = '100.00';
  text_buy: string;
  text_money: string
  currencyList: Currency[];
  availableCurrencyCodesToRequest: string[] = [];
  availableCurrencyCodesToReceive: string[] = [];
  availableCurrencyCodesLeft: string[] = [];
  availableCurrencyCodesRight: string[] = [];
  sellAvailableTransformations: string[] = [];
  buyAvailableTransformacions: string[] = [];
  operation = 'V';
  cantInput: any;
  @ViewChild('quantityInput') quantityInputElm: ElementRef;

  get cant(): number {
    return this._cant;
  }

  set cant(val: number) {
    let valAsString = String(val);
    let decimalPart = valAsString.split('.')[1];
    if (!!decimalPart && decimalPart.length > 2) {
      val = Number(val.toFixed(2));
    }
    this._cant = val;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private alerts: AlertUtil
    , private currencies: CurrenciesService, public appState: AppStateService
    , private dataService: DataService, private users: UsersService, private modals: ModalUtil,
    private modalCtrl: ModalController, private contests: ContestsService,
    public sanitizer: DomSanitizer, private constants: ConstantsService, private numberPipe: NumberPipe) {
    this.checkButton = 0;
    this.currencies.find().subscribe(results => {
      this.currencyList = results;
      this.selectedCurrencyLeft = this.currencyList.find(c => c.code == 'USD');
      this.selectedCurrencyRight = this.currencyList.find(c => c.code == 'PEN');
    });
    this.constants.findOneByCode('COTIZAR_QUIERO_MONEDAS_DISPONIBLES')
      .subscribe(result => {
        this.availableCurrencyCodesToRequest = result.content.split(',');
      });
    this.constants.findOneByCode('COTIZAR_TENGO_MONEDAS_DISPONIBLES')
      .subscribe(result => {
        this.availableCurrencyCodesToReceive = result.content.split(',');
      });
    this.constants.findOneByCode('COTIZAR_IZQUIERDA_MONEDAS_DISPONIBLES')
      .subscribe(result => {
        this.availableCurrencyCodesLeft = result.content.split(',');
      });
    this.constants.findOneByCode('COTIZAR_DERECHA_MONEDAS_DISPONIBLES')
      .subscribe(result => {
        this.availableCurrencyCodesRight = result.content.split(',');
      });
    this.constants.findOneByCode('COTIZAR_VENTA_TRANSFORMACION')
      .subscribe(result => {
        this.sellAvailableTransformations = result.content.split(',');
      });
    this.constants.findOneByCode('COTIZAR_COMPRA_TRANSFORMACION')
      .subscribe(result => {
        this.buyAvailableTransformacions = result.content.split(',');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotePage');
    this.dataService.getDataExchangueAgents().subscribe(data => {
      this.dataService.exchange_agents = data
    })
  }

  ionViewWillEnter() {
  }

  ngOnInit() {
    this.interceptVerifyCurrenTransaction();
    // this.quantityInputElm.nativeElement.addEventListener('keypress', function () {
    //   this.setAttribute('type', 'text');
    // });
    // this.quantityInputElm.nativeElement.addEventListener('click', function () {
    //   this.setAttribute('type', 'number');
    // });
  }

  interceptVerifyCurrenTransaction() {
    let { currentTransaction } = this.users.currentUser.person;
    if (!!currentTransaction) {
      if (!currentTransaction.personBankAccount) {
        this.navCtrl.push(CommonSelectBankAccountPage, { transaction: currentTransaction });
      } else {
        // this.navCtrl.push(CommonTransferToOtcPage,{ transaction: currentTransaction });
        this.navCtrl.push(CommonSelectBankAccountPage, { transaction: currentTransaction, next: true });
      }
    }
    if (this.users.currentUser.isPerson()) {
      if (this.users.currentUser.person.currentContest) {
        this.alerts.confirm('Tienes una búsqueda rápida en la cola, ¿Deseas continuar?', 'OTC Búsqueda rápida')
          .then(accepted => {
            if (accepted) {
              this.modals.openModal(this.modalCtrl, AvailableModals.FastSearchModal, {
                contest: {
                  id: this.users.currentUser.person.currentContest.id
                }
              }).then((contest: Contest) => {
                if (contest) {
                  this.contests.findOne(new ByIdSpecification(contest.id))
                    .subscribe(result => {
                      this.users.currentUser.person.currentContest = result;
                      this.navCtrl.push(ExchangeAgentsPage, {
                        operation: result.operationType,
                        currency: result.targetCurrency,
                        amount: result.amount,
                        contest: result
                      });
                    })
                }
              })
            } else {
              this.contests.cancelContest(this.users.currentUser.person.currentContest.id)
                .subscribe()
            }
          });
      }
    }
  }

  clickUser(numb) {
    this.checkButton = numb
  }

  onHandle(event) {
    this.selectedCurrencyLeft = event
  }

  nextPage() {
    this.checkButton = 1;

    // console.log(this.cant);
    if (!this.cant || this.cant > 10000) {
      window.navigator.vibrate(200);
      if ((this.cant || 0) <= 0) {
        this.alerts.show('El monto que ingresa tiene que ser mayor a 0', 'Cotiza');
      } else {
        this.alerts.show('El monto que ingresa es inválido, supera los $ 10 000.', 'Cotiza');
      }
      return;
    }

    let receivedCurrency = this.operation == 'C' ? this.selectedCurrencyLeft : this.selectedCurrencyRight;
    let requestedCurrency = this.operation == 'C' ? this.selectedCurrencyRight : this.selectedCurrencyLeft;

    if (this.availableCurrencyCodesToRequest.indexOf(requestedCurrency.code) < 0) {
      this.alerts.show('La moneda que usted quiere recibir no se encuentra habilitada', 'Cotiza');
      return;
    }

    if (this.availableCurrencyCodesToReceive.indexOf(receivedCurrency.code) < 0) {
      this.alerts.show('La moneda que usted tiene no se encuentra habilitada', 'Cotiza');
      return;
    }

    if (this.selectedCurrencyLeft.code == this.selectedCurrencyRight.code) {
      this.alerts.show('Las monedas deben ser diferentes', 'Cotiza');
      return;
    }

    let operation = this.operation;//this.getOperation();

    if ( /*!operation*/ !this.validateTransformation(receivedCurrency, requestedCurrency)) {
      this.alerts.show('El cambio que usted desea realizar no es válido', 'Cotiza');
      return;
    }

    this.appState.setState({
      price: {
        currency: receivedCurrency,
        receivedCurrency: receivedCurrency,
        requestedCurrency: requestedCurrency,
        cant: Number(this.cant),
        text_buy: operation == 'C' ? 'Compra' : 'Venta',
        text_money: this.selectedCurrencyLeft.symbol
      }
    })

    this.navCtrl.push(PersonSelectSearchModePage, {
      operation: operation,
      currency: receivedCurrency,
      receivedCurrency: receivedCurrency,
      requestedCurrency: requestedCurrency,
      amount: this.cant
    });
  }

  getCurrencyCountryFlag(currency: Currency) {
    if (currency.image) {
      return this.sanitizer.bypassSecurityTrustStyle(`url('${currency.image.fileUrl}')`);
    } else {
      return null;
    }
  }

  onChangeCurrencies() {
    let aux = this.selectedCurrencyLeft;
    this.selectedCurrencyLeft = this.selectedCurrencyRight;
    this.selectedCurrencyRight = aux;
  }

  onChangeQuieroTengo() {
    this.operation = this.operation == 'V' ? 'C' : 'V';
  }

  getOperation(): 'V' | 'C' {
    let currentTransformation = this.selectedCurrencyLeft.code + '->' + this.selectedCurrencyRight.code;
    if (this.sellAvailableTransformations.indexOf(currentTransformation) >= 0) {
      return 'V';
    }
    if (this.buyAvailableTransformacions.indexOf(currentTransformation) >= 0) {
      return 'C';
    }
    return null;
  }

  validateTransformation(receivedCurrency, requestedCurrency) {
    let currentTransformation = receivedCurrency.code + '->' + requestedCurrency.code;
    console.log(this.operation + ': ' + currentTransformation);
    if (
      this.operation == 'V' && !(this.sellAvailableTransformations.indexOf(currentTransformation) >= 0) ||
      this.operation == 'C' && !(this.buyAvailableTransformacions.indexOf(currentTransformation) >= 0)
    ) {
      return false;
    }
    return true;
  }

  modelChange(cant: string): void {
    var cantWithSpaces = this.numberPipe.transform(cant);
    this.cantInput = cantWithSpaces;
    this.cant = Number(this.numberPipe.parse(cantWithSpaces));
  }

  onCurrencyChange(currencySelected: Currency, currencyPropertyNameToChange: string) {
    let currencyCode = currencySelected.code;
    let otherCurrency = '';
    if (currencyCode == 'PEN') otherCurrency = 'USD';
    if (currencyCode == 'USD') otherCurrency = 'PEN';
    let currencyToChange = this.currencyList.find(c => c.code == otherCurrency);
    this[currencyPropertyNameToChange] = currencyToChange;
  }

  showCurrency(currency: Currency, side: 'left' | 'right'): boolean {
    /*let currentOperation = this.operation;
    if( currentOperation == 'C' ){ //Compra
      if( side == 'left' ){
        return this.availableCurrencyCodesToRequest.indexOf(currency.code) >= 0;
      }else{
        return this.availableCurrencyCodesToReceive.indexOf(currency.code) >= 0;
      }
    }else{ //Venta
      if( side == 'left' ){
        return this.availableCurrencyCodesToReceive.indexOf(currency.code) >= 0;
      }else{
        return this.availableCurrencyCodesToRequest.indexOf(currency.code) >= 0;
      }
    }*/
    if (side == 'left') {
      return this.availableCurrencyCodesLeft.indexOf(currency.code) >= 0;
    } else {
      return this.availableCurrencyCodesRight.indexOf(currency.code) >= 0;
    }
  }

}
