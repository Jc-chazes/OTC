import { Directive, HostListener, OnInit, ElementRef } from "@angular/core";
import { NumberPipe } from "../../pipes/numeric/number.pipe";

@Directive({ selector: "[only-numeric]" })
export class OnlyNumericDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    
  }

  @HostListener("keydown", ["$event"])
  preventCharacters(ev) {
    //let value = e.target.value;
    let char = String.fromCharCode(ev.which);
    // if ( !/^[0-9\.]*$/.test(value) ) {
    //   e.target.value = value.replace(/[^0-9\.]/g, '');
    // }
    if( isNaN(ev.key as any) && ev.key !== '.' && ev.key !== 'Tab' ){
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

}