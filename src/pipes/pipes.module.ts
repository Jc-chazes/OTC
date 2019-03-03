import { NgModule } from '@angular/core';
import { AgePipe } from './age/age';
import { NumberPipe } from './numeric/number.pipe';
@NgModule({
	declarations: [AgePipe,NumberPipe],
	imports: [],
	providers: [
		NumberPipe
	],
	exports: [AgePipe, NumberPipe]
})
export class PipesModule {}
