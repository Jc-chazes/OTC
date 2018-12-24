import { Component, Input } from '@angular/core';
import { UsersService } from '../../providers/users.service';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'otc-header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input() title: string;
  cssClass: string;

  constructor(private users: UsersService) {
    this.users.currentUserChanges().subscribe( user => {
      if(user){
        if( user.person ){
          this.cssClass = 'otcHeader--person'
        }else if( user.exchangeAgent ){
          this.cssClass = 'otcHeader--exchangeAgent'
        }
      }
    })
  }

}
