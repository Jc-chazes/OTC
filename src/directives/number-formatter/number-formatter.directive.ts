import { Directive, HostListener, OnInit, ElementRef } from "@angular/core";
import { NumberPipe } from "../../pipes/numeric/number.pipe";

@Directive({ selector: "[numberFormatter]" })
export class numberFormatterDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private numberPipe: NumberPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.numberPipe.transform(this.el.value);
  }

  @HostListener("focus", ["$event"])
  onFocus(event) {
    this.el.value = this.numberPipe.parse(event.target.value); // opossite of transform
  }

  @HostListener("blur", ["$event"])
  onBlur(event) {
    this.el.value = this.numberPipe.transform(event.target.value);
  }

  @HostListener("keypress", ["$event"])
  onKeyPress(event) {
    var key = event.charCode!==0?String.fromCharCode(event.charCode):'';
    if( isNaN(key as any) && key != '.' ){
      event.preventDefault();
    }
  }

}