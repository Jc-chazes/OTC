import { NgModule } from '@angular/core';
import { ProfileBackgroundColorDirective } from './profile-background-color/profile-background-color';
import { RippleEffectDirective } from './m-ripple-effect/m-ripple-effect';
@NgModule({
	declarations: [ProfileBackgroundColorDirective, RippleEffectDirective],
	imports: [],
	exports: [ProfileBackgroundColorDirective, RippleEffectDirective]
})
export class DirectivesModule {}
