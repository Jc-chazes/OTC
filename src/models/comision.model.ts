import { BaseModel } from "./base/base.model";

export class Comision extends BaseModel<Comision> {
    limiteInferior: number;
    limiteSuperior: number;
    valor: number;
    moneda: string;
}