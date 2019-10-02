import { BaseService } from "./base/base.service";
import { Injectable } from "@angular/core";
import { Comision } from "../models/comision.model";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Injectable()
export class ComisionesService extends BaseService {

    private _comisiones: Comision[];

    loadComisiones(): Observable<boolean> {
        return this.api.get('/comisions')
            .pipe(
                tap(resp => this._comisiones = resp),
                catchError(err => of(true))
            );
    }

    getComisionFor(monto: number, monedaCode: string) {
        const comisionesValidas = this._comisiones
            .filter(c => c.moneda === monedaCode)
            .filter(c => c.limiteInferior < monto && monto <= c.limiteSuperior);
        return comisionesValidas[0];

    }

}