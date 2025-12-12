import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SessionService {

    public setItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    public getItem(key: string) {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    public removeItem(key: string) {
        sessionStorage.removeItem(key);
    }

    public clear() {
        sessionStorage.clear();
    }
}