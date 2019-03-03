import { NgModule } from '@angular/core';
import { ProfileBackgroundColorDirective } from './profile-background-color/profile-background-color';
import { RippleEffectDirective } from './m-ripple-effect/m-ripple-effect';
import { numberFormatterDirective } from './number-formatter/number-formatter.directive';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
	declarations: [ProfileBackgroundColorDirective, RippleEffectDirective,numberFormatterDirective],
	imports: [PipesModule],
	exports: [ProfileBackgroundColorDirective, RippleEffectDirective,numberFormatterDirective]
})
export class DirectivesModule {}
