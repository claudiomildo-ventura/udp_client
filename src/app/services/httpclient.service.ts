import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpclientService {
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private readonly http: HttpClient) {
    }

    public getData$(url: string): Observable<any> {
        return this.http.get<any>(url, this.httpOptions);
    }

    public sendData$(url: string, data: any): Observable<any> {
        return this.http.post<any>(url, data, this.httpOptions);
    }

    public getDataItems$(url: string): Observable<any[]> {
        return this.http.get<any[]>(url, this.httpOptions);
    }
}
