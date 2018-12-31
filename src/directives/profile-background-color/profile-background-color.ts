import { Directive, OnDestroy, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { UsersService } from '../../providers/users.service';

/**
 * Generated class for the ProfileBackgroundColorDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[profile-background-color]' // Attribute selector
})
export class ProfileBackgroundColorDirective implements OnDestroy, OnInit {

  constructor(private users: UsersService, private elmRef: ElementRef,
    private renderer: Renderer2) {
    console.log('Hello ProfileBackgroundColorDirective Directive');
  }

  ngOnInit(){
    this.users.currentUserChanges().subscribe( user => {
      if(user){
        if( user.isPerson() ){
          this.renderer.addClass(this.elmRef.nativeElement,'otcHeader')
          this.renderer.addClass(this.elmRef.nativeElement,'otcHeader--person');
        }else if( user.exchangeAgent ){
          this.renderer.addClass(this.elmRef.nativeElement,'otcHeader');
          this.renderer.addClass(this.elmRef.nativeElement,'otcHeader--exchangeAgent');
        }
      }else{
        this.renderer.addClass(this.elmRef.nativeElement,'otcHeader')
        this.renderer.addClass(this.elmRef.nativeElement,'otcHeader--person');
      }
    })
  }

  ngOnDestroy(){

  }

}
