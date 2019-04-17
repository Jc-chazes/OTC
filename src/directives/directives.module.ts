import { NgModule } from '@angular/core';
import { ProfileBackgroundColorDirective } from './profile-background-color/profile-background-color';
import { RippleEffectDirective } from './m-ripple-effect/m-ripple-effect';
import { numberFormatterDirective } from './number-formatter/number-formatter.directive';
import { PipesModule } from '../pipes/pipes.module';
import { OnlyNumericDirective } from './only-numeric/only-numeric.direcitve';
@NgModule({
	declarations: [ProfileBackgroundColorDirective, RippleEffectDirective,numberFormatterDirective,OnlyNumericDirective],
	imports: [PipesModule],
	exports: [ProfileBackgroundColorDirective, RippleEffectDirective,numberFormatterDirective,OnlyNumericDirective]
})
export class DirectivesModule {}
