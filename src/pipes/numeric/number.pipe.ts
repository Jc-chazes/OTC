import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Injectable()
@Pipe({ name: 'number' })
export class NumberPipe implements PipeTransform{

    transform(value: any): string {
        return String(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    parse(value: any): any{
        return value.replace(/ /g,'');
    }
}