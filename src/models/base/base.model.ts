import { isEqual, pick } from 'lodash';

export class BaseModel<T>{

    id: number;
    created_at: Date;
    updated_at: Date;

    protected _backup: T;

    public set backup(value: T){
        this._backup = { ...(value as any) };
    }

    public createBackup(){
        this.backup = this as any;
    }

    hasChanged(fields: string[] = []): boolean {
        return !isEqual(pick(this,fields),pick(this._backup,fields));
    }

    constructor(partial? :Partial<T>){
        Object.assign(this,partial);
    }

}