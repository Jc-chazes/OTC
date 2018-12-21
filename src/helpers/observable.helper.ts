import { Observable } from "rxjs";
import { OnDestroy } from "@angular/core";

export const componentDestroyed = ( ngComponent: OnDestroy ) => {
    return new Observable<boolean>( (sub) => {
        let oldOnDestroy = ngComponent.ngOnDestroy.bind(ngComponent) || ( ()=>{} );
        ngComponent.ngOnDestroy = () => {
            sub.next(true);
            sub.complete();
            sub.unsubscribe();
            oldOnDestroy();
        }
    });
}