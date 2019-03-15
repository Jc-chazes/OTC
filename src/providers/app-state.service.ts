import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppStateService{

  initialState: any = {
    global: {
      userType: '0'
    },
    login: {
      selectedUserType: 0
    },
    register: {
      savedUserBankAccount: []
    },
    price: {
      currency: "",
      cant: 0,
      text_buy :"",
      text_money:""
    },
    detail_exchangue :{},
  };

  private onStateChangeSubject = new BehaviorSubject<any>(this.initialState);

  onStateChange = this.onStateChangeSubject.asObservable();

  get currentState(): any{
    return this.onStateChangeSubject.value;
  }

  setState(partialState: any){
    let newState = Object.assign(this.onStateChangeSubject.value,partialState);
    this.onStateChangeSubject.next(newState);
  }

  forceUpdate(){
    this.onStateChangeSubject.next({ ...this.onStateChangeSubject.value });
  }



}