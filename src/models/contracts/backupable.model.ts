export interface BackupableModel<T>{
    
    backup: T;

    hasChanged(): boolean;

}